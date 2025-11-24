const { DefaultAzureCredential, ClientSecretCredential } = require('@azure/identity');
const { ResourceManagementClient } = require('@azure/arm-resources');
const { ComputeManagementClient } = require('@azure/arm-compute');
const { SqlManagementClient } = require('@azure/arm-sql');
const { NetworkManagementClient } = require('@azure/arm-network');
const { StorageManagementClient } = require('@azure/arm-storage');

const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

// Create credential
const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

// Initialize Azure clients
const resourceClient = new ResourceManagementClient(credential, subscriptionId);
const computeClient = new ComputeManagementClient(credential, subscriptionId);
const sqlClient = new SqlManagementClient(credential, subscriptionId);
const networkClient = new NetworkManagementClient(credential, subscriptionId);
const storageClient = new StorageManagementClient(credential, subscriptionId);

async function executeAzureQuery(analysis) {
  try {
    const { intent, resourceType, resourceName, parameters } = analysis;

    // Handle list_all intent for listing all resources of a type
    if (intent === 'list_all' && resourceName === 'all') {
      return await listAllResources(resourceType, parameters);
    }

    // Route to appropriate handler based on intent and resource type
    if (intent === 'get_cost') {
      return await getCostData(resourceName, parameters);
    }

    switch (resourceType) {
      case 'virtualMachine':
        return await queryVirtualMachine(resourceName, intent, parameters);
      
      case 'database':
        return await queryDatabase(resourceName, intent, parameters);
      
      case 'virtualNetwork':
        return await queryVirtualNetwork(resourceName, intent, parameters);
      
      case 'subnet':
        return await querySubnet(resourceName, parameters);
      
      case 'storageAccount':
        return await queryStorageAccount(resourceName, intent, parameters);
      
      case 'resourceGroup':
        return await queryResourceGroup(resourceName, intent);
      
      default:
        return await queryGenericResource(resourceName, resourceType, intent, parameters);
    }

  } catch (error) {
    console.error('Error executing Azure query:', error);
    return {
      error: error.message,
      details: error.code || 'UNKNOWN_ERROR'
    };
  }
}

async function queryVirtualMachine(vmName, intent, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    for (const rg of resourceGroups) {
      try {
        const vm = await computeClient.virtualMachines.get(rg, vmName, { expand: 'instanceView' });
        
        if (intent === 'get_status') {
          return {
            data: {
              name: vm.name,
              resourceGroup: rg,
              powerState: vm.instanceView?.statuses?.find(s => s.code.startsWith('PowerState/'))?.displayStatus || 'Unknown',
              provisioningState: vm.provisioningState,
              location: vm.location
            }
          };
        }
        
        if (intent === 'get_configuration') {
          return {
            data: {
              name: vm.name,
              resourceGroup: rg,
              vmSize: vm.hardwareProfile?.vmSize,
              osType: vm.storageProfile?.osDisk?.osType,
              location: vm.location,
              tags: vm.tags
            }
          };
        }
        
        // Default: return full info
        return {
          data: {
            name: vm.name,
            resourceGroup: rg,
            vmSize: vm.hardwareProfile?.vmSize,
            location: vm.location,
            powerState: vm.instanceView?.statuses?.find(s => s.code.startsWith('PowerState/'))?.displayStatus || 'Unknown',
            provisioningState: vm.provisioningState,
            osType: vm.storageProfile?.osDisk?.osType,
            tags: vm.tags
          }
        };
        
      } catch (error) {
        if (error.statusCode === 404) continue;
        throw error;
      }
    }
    
    return { error: `Virtual Machine '${vmName}' not found in any accessible resource group` };
    
  } catch (error) {
    return { error: `Failed to query VM: ${error.message}` };
  }
}

async function queryDatabase(dbName, intent, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    // Try to find SQL databases
    for (const rg of resourceGroups) {
      try {
        // List SQL servers in resource group
        const servers = await sqlClient.servers.listByResourceGroup(rg);
        
        for await (const server of servers) {
          try {
            const databases = await sqlClient.databases.listByServer(rg, server.name);
            
            for await (const db of databases) {
              if (db.name.toLowerCase() === dbName.toLowerCase()) {
                return {
                  data: {
                    name: db.name,
                    serverName: server.name,
                    resourceGroup: rg,
                    sku: db.sku?.name,
                    tier: db.sku?.tier,
                    capacity: db.sku?.capacity,
                    status: db.status,
                    location: db.location,
                    maxSizeBytes: db.maxSizeBytes,
                    collation: db.collation
                  }
                };
              }
            }
          } catch (err) {
            console.error(`Error querying databases on server ${server.name}:`, err.message);
          }
        }
      } catch (error) {
        if (error.statusCode === 404) continue;
        console.error(`Error in resource group ${rg}:`, error.message);
      }
    }
    
    return { error: `Database '${dbName}' not found in any accessible resource group` };
    
  } catch (error) {
    return { error: `Failed to query database: ${error.message}` };
  }
}

async function queryVirtualNetwork(vnetName, intent, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    for (const rg of resourceGroups) {
      try {
        const vnet = await networkClient.virtualNetworks.get(rg, vnetName);
        
        if (intent === 'count_resources' || vnetName.toLowerCase().includes('subnet')) {
          const subnetCount = vnet.subnets?.length || 0;
          return {
            data: {
              vnetName: vnet.name,
              resourceGroup: rg,
              subnetCount,
              subnets: vnet.subnets?.map(s => ({
                name: s.name,
                addressPrefix: s.addressPrefix,
                resourceCount: s.ipConfigurations?.length || 0
              }))
            }
          };
        }
        
        return {
          data: {
            name: vnet.name,
            resourceGroup: rg,
            location: vnet.location,
            addressSpace: vnet.addressSpace?.addressPrefixes,
            subnetCount: vnet.subnets?.length || 0,
            subnets: vnet.subnets?.map(s => s.name)
          }
        };
        
      } catch (error) {
        if (error.statusCode === 404) continue;
        throw error;
      }
    }
    
    return { error: `Virtual Network '${vnetName}' not found` };
    
  } catch (error) {
    return { error: `Failed to query VNet: ${error.message}` };
  }
}

async function querySubnet(vnetName, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    for (const rg of resourceGroups) {
      try {
        const vnets = networkClient.virtualNetworks.list(rg);
        
        for await (const vnet of vnets) {
          if (vnet.name.toLowerCase() === vnetName.toLowerCase()) {
            const subnetCount = vnet.subnets?.length || 0;
            return {
              data: {
                vnetName: vnet.name,
                resourceGroup: rg,
                subnetCount,
                subnets: vnet.subnets?.map(s => ({
                  name: s.name,
                  addressPrefix: s.addressPrefix
                }))
              }
            };
          }
        }
      } catch (error) {
        console.error(`Error querying VNets in ${rg}:`, error.message);
      }
    }
    
    return { error: `Could not find subnet information for '${vnetName}'` };
    
  } catch (error) {
    return { error: `Failed to query subnets: ${error.message}` };
  }
}

async function queryStorageAccount(storageAccountName, intent, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    for (const rg of resourceGroups) {
      try {
        const storageAccount = await storageClient.storageAccounts.getProperties(rg, storageAccountName);
        
        return {
          data: {
            name: storageAccount.name,
            resourceGroup: rg,
            sku: storageAccount.sku?.name,
            kind: storageAccount.kind,
            location: storageAccount.location,
            provisioningState: storageAccount.provisioningState,
            accessTier: storageAccount.accessTier,
            enableHttpsTrafficOnly: storageAccount.enableHttpsTrafficOnly
          }
        };
        
      } catch (error) {
        if (error.statusCode === 404) continue;
        throw error;
      }
    }
    
    return { error: `Storage Account '${storageAccountName}' not found` };
    
  } catch (error) {
    return { error: `Failed to query storage account: ${error.message}` };
  }
}

async function queryResourceGroup(rgName, intent) {
  try {
    const rg = await resourceClient.resourceGroups.get(rgName);
    
    if (intent === 'list_resources' || intent === 'count_resources') {
      const resources = [];
      const resourceList = resourceClient.resources.listByResourceGroup(rgName);
      
      for await (const resource of resourceList) {
        resources.push({
          name: resource.name,
          type: resource.type,
          location: resource.location
        });
      }
      
      return {
        data: {
          resourceGroup: rg.name,
          location: rg.location,
          resourceCount: resources.length,
          resources: intent === 'list_resources' ? resources : undefined
        }
      };
    }
    
    return {
      data: {
        name: rg.name,
        location: rg.location,
        provisioningState: rg.properties?.provisioningState,
        tags: rg.tags
      }
    };
    
  } catch (error) {
    return { error: `Failed to query resource group: ${error.message}` };
  }
}

async function queryGenericResource(resourceName, resourceType, intent, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    
    for (const rg of resourceGroups) {
      const resources = resourceClient.resources.listByResourceGroup(rg);
      
      for await (const resource of resources) {
        if (resource.name.toLowerCase() === resourceName.toLowerCase()) {
          return {
            data: {
              name: resource.name,
              type: resource.type,
              resourceGroup: rg,
              location: resource.location,
              id: resource.id
            }
          };
        }
      }
    }
    
    return { error: `Resource '${resourceName}' not found` };
    
  } catch (error) {
    return { error: `Failed to query resource: ${error.message}` };
  }
}

async function getCostData(resourceName, parameters) {
  try {
    // This is a simplified cost query
    // In production, you'd use Cost Management API with proper date ranges
    return {
      data: {
        message: 'Cost data retrieval requires additional configuration',
        note: 'Please configure Cost Management API access and implement time-range queries',
        resourceName,
        timePeriod: parameters.timePeriod || 'not specified'
      }
    };
  } catch (error) {
    return { error: `Failed to get cost data: ${error.message}` };
  }
}

async function listAllResources(resourceType, parameters) {
  try {
    const resourceGroups = await getResourceGroups(parameters.resourceGroup);
    const allResources = [];

    for (const rg of resourceGroups) {
      try {
        const resources = resourceClient.resources.listByResourceGroup(rg);
        
        for await (const resource of resources) {
          // Filter by resource type if specified
          if (resourceType === 'generic' ||
              resource.type.toLowerCase().includes(resourceType.toLowerCase())) {
            allResources.push({
              name: resource.name,
              type: resource.type,
              resourceGroup: rg,
              location: resource.location,
              id: resource.id
            });
          }
        }
      } catch (error) {
        console.error(`Error listing resources in ${rg}:`, error.message);
      }
    }

    return {
      data: {
        resourceType: resourceType === 'generic' ? 'all resources' : resourceType,
        count: allResources.length,
        resources: allResources
      },
      source: 'Azure Resource Manager'
    };

  } catch (error) {
    console.error('Error listing all resources:', error);
    return {
      error: `Failed to list ${resourceType} resources: ${error.message}`
    };
  }
}

async function getResourceGroups(specificRg) {
  if (specificRg) {
    return [specificRg];
  }
  
  // Check if specific resource groups are configured
  if (process.env.RESOURCE_GROUPS) {
    return process.env.RESOURCE_GROUPS.split(',').map(rg => rg.trim());
  }
  
  // Otherwise, get all resource groups
  const rgs = [];
  const resourceGroups = resourceClient.resourceGroups.list();
  
  for await (const rg of resourceGroups) {
    rgs.push(rg.name);
  }
  
  return rgs;
}

module.exports = { executeAzureQuery };