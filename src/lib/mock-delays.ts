// Mock delays for testing loading states in development
export const mockDelays = {
  // Short delays for quick operations
  short: () => new Promise(resolve => setTimeout(resolve, 800)),
  
  // Medium delays for standard operations
  medium: () => new Promise(resolve => setTimeout(resolve, 1500)),
  
  // Long delays for complex operations
  long: () => new Promise(resolve => setTimeout(resolve, 2500)),
  
  // Extra long for testing patience
  extraLong: () => new Promise(resolve => setTimeout(resolve, 4000)),
  
  // Random delay between min and max (in ms)
  random: (min: number = 1000, max: number = 3000) => 
    new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min)),
  
  // Conditional delay - only in development
  development: (delay: number = 2000) => 
    import.meta.env.DEV ? new Promise(resolve => setTimeout(resolve, delay)) : Promise.resolve(),
  
  // Simulate network conditions
  network: {
    fast: () => new Promise(resolve => setTimeout(resolve, 300)),
    slow: () => new Promise(resolve => setTimeout(resolve, 2000)),
    veryslow: () => new Promise(resolve => setTimeout(resolve, 5000)),
    timeout: () => new Promise(resolve => setTimeout(resolve, 8000))
  }
};

// Helper to add delay to any async function
export const withDelay = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delayMs: number = 2000
): T => {
  return (async (...args: any[]) => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return fn(...args);
  }) as T;
};

// Simulate loading states for different operations
export const loadingSimulation = {
  tableLoad: () => mockDelays.development(1800),
  sessionEvaluation: () => mockDelays.development(3000),
  sampleAnalysis: () => mockDelays.development(2200),
  reportGeneration: () => mockDelays.development(2800),
  dataExport: () => mockDelays.development(2500),
  authentication: () => mockDelays.development(1500),
  sessionCreation: () => mockDelays.development(2000),
  orderingCalculation: () => mockDelays.development(1600)
};