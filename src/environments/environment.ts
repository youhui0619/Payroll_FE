// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3001',
  // apiURL: 'https://mortgagebe.uhuidesignstudio.my',
  firebaseConfig: {
    apiKey: "AIzaSyAAIxXIKgxQmxo58TFlrHU_HkgAN_vlejs",
    authDomain: "payroll-system-6ae9b.firebaseapp.com",
    projectId: "payroll-system-6ae9b",
    storageBucket: "payroll-system-6ae9b.firebasestorage.app",
    messagingSenderId: "452876600395",
    appId: "1:452876600395:web:5bc68515bfb30d213639ce"
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
