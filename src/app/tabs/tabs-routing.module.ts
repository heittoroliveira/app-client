import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
      },
  {
    path: '',
    component: TabsPage,
    children: [
       
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'eventos',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../eventos/eventos.module').then(m => m.EventosPageModule)
          }
        ]
      },
      {
        path: 'mapa',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mapa/mapa.module').then(m => m.MapaPageModule)
          }
        ]
      },
      {
        path: 'busca',
        children: [
            {
                path: '',
                loadChildren: () => 
                import('../busca/busca.module').then( m => m.BuscaPageModule)
            }
        ]
      },
      {
        path: 'sobre',
        children: [
          {
            path: '',
            loadChildren: () => 
                import('../sobre/sobre.module').then( m => m.SobrePageModule)
          }
        ]
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
