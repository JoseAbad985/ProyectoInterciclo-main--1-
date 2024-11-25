import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MainComponent } from './pages/main/main.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ListarUsuariosComponent } from './pages/listar-usuarios/listar-usuarios.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { EditarPerfilElegidoComponent } from './pages/editar-perfil-elegido/editar-perfil-elegido.component';
import { UsuarioEmComponent } from './pages/usuario-em/usuario-em.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { ListarContratosComponent } from './pages/listar-contratos/listar-contratos.component';
import { ConfParqueoComponent } from './pages/conf-parqueo/conf-parqueo.component';
import { EditarContratoComponent } from './pages/editar-contrato/editar-contrato.component';


export const routes: Routes = [

    {
        path: '',
        component : InicioComponent
    },

    {
        path: 'pages/inicio',
        component: InicioComponent
    },
    {
        path: 'pages/Main',
        component: MainComponent
    },
    {
        path: 'pages/Perfil',
        component: PerfilComponent
    },
    {
        path: 'pages/listar',
        component: ListarUsuariosComponent
    },
    {
        path: 'pages/editar',
        component: EditarPerfilComponent
    },
    {
        path: 'pages/editarPerfilE',
        component: EditarPerfilElegidoComponent
    },
    {
        path: 'pages/editPerfilU',
        component: UsuarioEmComponent
    },
    {
        path: 'pages/contratos',
        component: ContratosComponent
    },
    {
        path: 'pages/listarCon',
        component: ListarContratosComponent
    },
    {
        path: 'pages/configParqueo',
        component: ConfParqueoComponent
    },
    { 
        path: 'listar-contratos', 
        component: ListarContratosComponent 
    },
    { 
        path: 'editar-contrato/:id', 
        component: EditarContratoComponent 
    },


];
