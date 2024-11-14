// export interface Project {
//     id: string;
//     name: string;
//     owner: string; // wallet address
//     githubUrl?: string;
//     deploymentUrl?: string;
//     port?: string;
//     envVars?: Record<string, string>;
//     createdAt?: string;
//     status: 'created' | 'deployed' | 'failed';
//   }
  
  export interface DeploymentResult {
    status: 'created' | 'deployed' | 'failed';
    url: string;
    port: string;
    error?: string;
  }
  export interface Project {
    id: string;
    name: string;
    description: string;
    address: string;
    chainId: number;
    status: 'created' | 'deployed' | 'failed';
    metadata?: {
      githubUrl?: string;
      deploymentUrl?: string;
      port?: string;
      envVars?: Record<string, string>;
      createdAt?: string;
      // ... any other metadata fields
    };
  }

