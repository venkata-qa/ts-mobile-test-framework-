declare namespace WebdriverIO {
  interface Browser {
    // Add the essential WebdriverIO Browser interface properties
    $: (selector: string) => Promise<WebdriverIO.Element>;
    $$: (selector: string) => Promise<WebdriverIO.Element[]>;
    executeScript: (script: string | Function, ...args: any[]) => Promise<any>;
    url: (url?: string) => Promise<string>;
    getUrl: () => Promise<string>;
    getTitle: () => Promise<string>;
    setTimeout: (timeouts: { implicit?: number, pageLoad?: number, script?: number }) => Promise<void>;
    pause: (ms: number) => Promise<void>;
    
    // Add mobile-specific commands
    getContexts: () => Promise<string[]>;
    switchContext: (contextName: string) => Promise<void>;
    getOrientation: () => Promise<string>;
    setOrientation: (orientation: string) => Promise<void>;
    installApp: (appPath: string) => Promise<void>;
    activateApp: (bundleId: string) => Promise<void>;
    terminateApp: (bundleId: string) => Promise<void>;
    isAppInstalled: (bundleId: string) => Promise<boolean>;
    
    // Additional convenience methods
    saveScreenshot: (filepath: string) => Promise<void>;
  }

  interface Element {
    // Add essential element methods
    click: () => Promise<void>;
    setValue: (value: string) => Promise<void>;
    addValue: (value: string) => Promise<void>;
    getText: () => Promise<string>;
    getAttribute: (attributeName: string) => Promise<string>;
    isDisplayed: () => Promise<boolean>;
    isEnabled: () => Promise<boolean>;
    isSelected: () => Promise<boolean>;
    waitForDisplayed: (options?: { timeout?: number, reverse?: boolean }) => Promise<boolean>;
    waitForExist: (options?: { timeout?: number, reverse?: boolean }) => Promise<boolean>;
    waitForEnabled: (options?: { timeout?: number, reverse?: boolean }) => Promise<boolean>;
  }
}
