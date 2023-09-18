export const extensionRoutes = [  {
    path: 'extensions/greet',
    loadChildren: () => import('./extensions/2120a6098f581c8e4004544cfab36446b9e7393824e84f98b4ab23206457a1b2/AddressSelector.module').then(m => m.AddressSelectorModule),
  }];
