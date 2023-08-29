<?php

namespace App\Controller\Admin;

use App\Domain\Entity\Gallery;
use App\Domain\Entity\Image;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\UserMenu;
use Symfony\Component\Security\Core\User\UserInterface;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin")
     */
    public function index(): Response
    {
        // redirect to some CRUD controller
        $routeBuilder = $this->get(AdminUrlGenerator::class);

        return $this->redirect($routeBuilder->setController(GalleryCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('<img src="../images/logo.png" />');
    }

    public function configureCrud(): Crud
    {
        return Crud::new();
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linktoDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Galleries', 'fas fa-images', Gallery::class);
        yield MenuItem::linkToCrud('Images', 'far fa-image', Image::class);
    }

    public function configureUserMenu(UserInterface $user): UserMenu
    {
        $userMenu = parent::configureUserMenu($user);
        $userMenu->setMenuItems([]);
        return $userMenu;
    }
}
