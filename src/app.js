import "./styles.css";
import './core/polyfills';
import './core/platform';
import './core/elementHrefs';
import './core/sizeTextarea';

import HomePage from './pages/home';
import LoginPage from './pages/login';
import NewProjectPage from './pages/projectCreate';
import ProfilePage from './pages/profile';
import EditProjectPage from './pages/projectEdit';
import ProjectList from './pages/projectList';
import ProjectPage from './pages/project';
import RegisterPage from './pages/register';
import ResetPasswordPage from './pages/resetPassword';

import Site from './site/site';
new Site({
    '': HomePage,
    'login': LoginPage,
    'login/register': RegisterPage,
    'login/forgot-password': ResetPasswordPage,
    'profile/:userId': ProfilePage,
    'profile/forgot-password': ResetPasswordPage,
    'projects': ProjectList,
    'projects/new': NewProjectPage,
    'projects/:projectId': ProjectPage,
    'projects/:projectId/edit': EditProjectPage
});
