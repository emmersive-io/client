import './styles.css';
import './core/polyfills';
import './core/platform';
import './forms/infieldForms';
import './core/sizeTextarea';

import iconLoader from './core/iconLoader';
iconLoader('icons.svg');

import ChangeEmailPage from './pages/changeEmail';
import ChangePasswordPage from './pages/changePassword';
import EditProjectPage from './pages/projectEdit';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import NewProjectPage from './pages/projectCreate';
import ProfilePage from './pages/profile';
import ProjectList from './pages/projectList';
import ProjectMembersPage from './pages/projectMembers';
import ProjectPage from './pages/project';
import RegisterPage from './pages/register';
import ResetPasswordPage from './pages/resetPassword';

import Site from './site/site';
new Site(HomePage, {
    'login': LoginPage,
    'login/register': RegisterPage,
    'login/forgot-password': ResetPasswordPage,
    'profile/:userId': ProfilePage,
    'profile/change-email': ChangeEmailPage,
    'profile/change-password': ChangePasswordPage,
    'projects': ProjectList,
    'projects/new': NewProjectPage,
    'projects/:projectId': ProjectPage,
    'projects/:projectId/edit': EditProjectPage,
    'projects/:projectId/members': ProjectMembersPage
});
