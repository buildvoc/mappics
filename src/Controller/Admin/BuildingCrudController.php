<?php

namespace App\Controller\Admin;

use App\Domain\Entity\Building;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class BuildingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Building::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields(['id', 'osTopoToid', 'osTopoToidVersion', 'tileRef', 'absMin', 'absH2', 'absHMax', 'relH2', 'relHMax', 'bhaConf'])
            ->setPaginatorPageSize(30);
    }

    public function configureFields(string $pageName): iterable
    {
        $osTopoToid = TextField::new('osTopoToid', 'OS Topo Toid');
        $osTopoToidVersion = IntegerField::new('osTopoToidVersion');
        $bhaProcessDate = DateField::new('bhaProcessDate');
        $tileRef = TextField::new('tileRef');
        $absMin = TextField::new('absMin', 'ABS Min');
        $absH2 = TextField::new('absH2', 'ABS H2');
        $absHMax = TextField::new('absHMax', 'ABS H Max');
        $relH2 = TextField::new('relH2', 'Rel H2');
        $relHMax = TextField::new('relHMax', 'Rel H Max');
        $bhaConf = TextField::new('bhaConf', 'BHA Conf');
        $createdAt = DateTimeField::new('createdAt', 'Created At');

        if (Crud::PAGE_INDEX === $pageName) {
            return [$osTopoToid, $absMin, $absH2, $absHMax, $relH2, $relHMax, $bhaConf, $createdAt];
        } elseif (Crud::PAGE_DETAIL === $pageName) {
            return [$osTopoToid, $absMin, $absH2, $absHMax, $relH2, $relHMax, $bhaConf, $createdAt];
        } elseif (Crud::PAGE_NEW === $pageName) {
            return [$osTopoToid, $osTopoToidVersion, $bhaProcessDate, $tileRef, $absMin, $absH2, $absHMax, $relH2, $relHMax, $bhaConf, $createdAt];
        } elseif (Crud::PAGE_EDIT === $pageName) {
            return [$osTopoToid, $osTopoToidVersion, $bhaProcessDate, $tileRef, $absMin, $absH2, $absHMax, $relH2, $relHMax, $bhaConf, $createdAt];
        }
    }
}
