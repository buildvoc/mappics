<?php

namespace App\Controller\Admin;

use App\Domain\Entity\Gallery;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class GalleryCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Gallery::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields(['id', 'path', 'name', 'slug'])
            ->setPaginatorPageSize(30);
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->disable('edit', 'new');
    }

    public function configureFields(string $pageName): iterable
    {
        $path = TextField::new('path');
        $name = TextField::new('name');
        $slug = TextField::new('slug');
        $createdAt = DateTimeField::new('createdAt');
        $images = AssociationField::new('images');
        $id = TextField::new('id', 'ID');

        if (Crud::PAGE_INDEX === $pageName) {
            return [$name, $slug, $path, $images, $createdAt];
        } elseif (Crud::PAGE_DETAIL === $pageName) {
            return [$id, $path, $name, $slug, $createdAt];
        } elseif (Crud::PAGE_NEW === $pageName) {
            return [$path, $name, $slug, $createdAt, $images];
        } elseif (Crud::PAGE_EDIT === $pageName) {
            return [$path, $name, $slug, $createdAt, $images];
        }
    }
}
