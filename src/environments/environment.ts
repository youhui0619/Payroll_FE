// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3001',
  // apiURL: 'https://mortgagebe.uhuidesignstudio.my',
  firebaseConfig: {
    apiKey: "AIzaSyDg8S_lb8KrEUjmS0PMesvLpXVxtpe_gGk",
    authDomain: "warehouse-system-71d14.firebaseapp.com",
    projectId: "warehouse-system-71d14",
    storageBucket: "warehouse-system-71d14.firebasestorage.app",
    messagingSenderId: "218894287172",
    appId: "1:218894287172:web:1be341bf6a0a654a4a1711",
    measurementId: "G-78820WM8DQ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
