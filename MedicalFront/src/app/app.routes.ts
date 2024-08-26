import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AboutComponent } from "./pages/about/about.component";
import { DocsComponent } from "./pages/docs/docs.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { MailComponent } from './components/mail/mail.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './components/patient-dashboard/patient-dashboard.component';
import { OrganizationDashboardComponent } from './components/organization-dashboard/organization-dashboard.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    {path: 'about', component: AboutComponent},
    {path: 'docs', component: DocsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'activate', component: MailComponent},
    {path: 'doctor-dashboard', component: DoctorDashboardComponent},
    {path: 'patient-dashboard', component: PatientDashboardComponent},
    {path: 'organization-dashboard', component: OrganizationDashboardComponent}
];