<?php
declare(strict_types = 1);

namespace App\Domain\Entity;

use Carbon\Carbon;

class Building
{
    /** @var string */
    private $id;

    /** @var string */
    private $osTopoToid;

    /** @var integer */
    private $osTopoToidVersion;

    /** @var date */
    private $bhaProcessDate;

    /** @var string */
    private $tileRef;

    /** @var string */
    private $absMin;

    /** @var string */
    private $absH2;

    /** @var string */
    private $absHMax;

    /** @var string */
    private $relH2;

    /** @var string */
    private $relHMax;

    /** @var string */
    private $bhaConf;

    /** @var \DateTime */
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = new Carbon();
    }

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of osTopoToid
     */ 
    public function getOsTopoToid()
    {
        return $this->osTopoToid;
    }

    /**
     * Set the value of osTopoToid
     *
     * @return  self
     */ 
    public function setOsTopoToid($osTopoToid)
    {
        $this->osTopoToid = $osTopoToid;

        return $this;
    }

    /**
     * Get the value of osTopoToidVersion
     */ 
    public function getOsTopoToidVersion()
    {
        return $this->osTopoToidVersion;
    }

    /**
     * Set the value of osTopoToidVersion
     *
     * @return  self
     */ 
    public function setOsTopoToidVersion($osTopoToidVersion)
    {
        $this->osTopoToidVersion = $osTopoToidVersion;

        return $this;
    }

    /**
     * Get the value of bhaProcessDate
     */ 
    public function getBhaProcessDate()
    {
        return $this->bhaProcessDate;
    }

    /**
     * Set the value of bhaProcessDate
     *
     * @return  self
     */ 
    public function setBhaProcessDate($bhaProcessDate)
    {
        $this->bhaProcessDate = $bhaProcessDate;

        return $this;
    }

    /**
     * Get the value of tileRef
     */ 
    public function getTileRef()
    {
        return $this->tileRef;
    }

    /**
     * Set the value of tileRef
     *
     * @return  self
     */ 
    public function setTileRef($tileRef)
    {
        $this->tileRef = $tileRef;

        return $this;
    }

    /**
     * Get the value of absMin
     */ 
    public function getAbsMin()
    {
        return $this->absMin;
    }

    /**
     * Set the value of absMin
     *
     * @return  self
     */ 
    public function setAbsMin($absMin)
    {
        $this->absMin = $absMin;

        return $this;
    }

    /**
     * Get the value of absH2
     */ 
    public function getAbsH2()
    {
        return $this->absH2;
    }

    /**
     * Set the value of absH2
     *
     * @return  self
     */ 
    public function setAbsH2($absH2)
    {
        $this->absH2 = $absH2;

        return $this;
    }

    /**
     * Get the value of absHMax
     */ 
    public function getAbsHMax()
    {
        return $this->absHMax;
    }

    /**
     * Set the value of absHMax
     *
     * @return  self
     */ 
    public function setAbsHMax($absHMax)
    {
        $this->absHMax = $absHMax;

        return $this;
    }

    /**
     * Get the value of relH2
     */ 
    public function getRelH2()
    {
        return $this->relH2;
    }

    /**
     * Set the value of relH2
     *
     * @return  self
     */ 
    public function setRelH2($relH2)
    {
        $this->relH2 = $relH2;

        return $this;
    }

    /**
     * Get the value of relHMax
     */ 
    public function getRelHMax()
    {
        return $this->relHMax;
    }

    /**
     * Set the value of relHMax
     *
     * @return  self
     */ 
    public function setRelHMax($relHMax)
    {
        $this->relHMax = $relHMax;

        return $this;
    }

    /**
     * Get the value of bhaConf
     */ 
    public function getBhaConf()
    {
        return $this->bhaConf;
    }

    /**
     * Set the value of bhaConf
     *
     * @return  self
     */ 
    public function setBhaConf($bhaConf)
    {
        $this->bhaConf = $bhaConf;

        return $this;
    }

    /**
     * Get the value of createdAt
     */ 
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set the value of createdAt
     *
     * @return  self
     */ 
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
