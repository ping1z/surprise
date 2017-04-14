-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema surprise
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `surprise` ;

-- -----------------------------------------------------
-- Schema surprise
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `surprise` DEFAULT CHARACTER SET utf8 ;
USE `surprise` ;

-- -----------------------------------------------------
-- Table `surprise`.`Address`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Address` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Address` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `line1` VARCHAR(128) NOT NULL,
  `line2` VARCHAR(128) NULL DEFAULT NULL,
  `city` VARCHAR(64) NOT NULL,
  `state` VARCHAR(64) NOT NULL,
  `zipcode` INT(11) NOT NULL,
  `country` VARCHAR(64) NOT NULL DEFAULT 'United States',
  `telephone` VARCHAR(16) NULL DEFAULT NULL,
  `isDefault` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Admin` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Admin` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(64) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Card`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Card` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Card` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NOT NULL,
  `type` VARCHAR(16) NOT NULL DEFAULT 'VIAS',
  `name` VARCHAR(128) NOT NULL,
  `cardNumber` VARCHAR(32) NULL DEFAULT '0',
  `line1` VARCHAR(128) NOT NULL,
  `line2` VARCHAR(128) NULL DEFAULT NULL,
  `city` VARCHAR(64) NOT NULL,
  `state` VARCHAR(64) NOT NULL,
  `zipcode` INT(11) NOT NULL,
  `expirationDate` VARCHAR(16) NOT NULL,
  `cvv` VARCHAR(8) NOT NULL,
  `isDefault` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Cart`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Cart` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Cart` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `productSKU` INT(11) NULL DEFAULT NULL,
  `quantity` INT(11) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Customer` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Customer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `firstName` VARCHAR(32) NOT NULL,
  `middleName` VARCHAR(32) NULL DEFAULT NULL,
  `lastName` VARCHAR(32) NOT NULL,
  `createdTime` DATETIME NOT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`LineItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`LineItem` ;

CREATE TABLE IF NOT EXISTS `surprise`.`LineItem` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `orderId` INT(11) NULL DEFAULT NULL,
  `productSKU` INT(11) NULL DEFAULT NULL,
  `shipmentId` INT(11) NULL DEFAULT NULL,
  `productName` VARCHAR(255) NULL DEFAULT NULL,
  `price` FLOAT NULL DEFAULT NULL,
  `quantity` INT(11) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Order` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Order` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `addressId` INT(11) NULL DEFAULT NULL,
  `cardId` INT(11) NULL DEFAULT NULL,
  `totalBeforeTax` FLOAT NULL DEFAULT NULL,
  `tax` FLOAT NULL DEFAULT NULL,
  `taxRate` FLOAT NULL DEFAULT NULL,
  `shippingCost` FLOAT NULL DEFAULT NULL,
  `lineItemCount` INT(11) NULL DEFAULT NULL,
  `trackingNumber` VARCHAR(45) NOT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `trackingNumber_UNIQUE` (`trackingNumber` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`OrderPayment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`OrderPayment` ;

CREATE TABLE IF NOT EXISTS `surprise`.`OrderPayment` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `orderId` INT(11) NULL DEFAULT NULL,
  `amount` FLOAT NULL DEFAULT NULL,
  `currencyType` VARCHAR(8) NULL DEFAULT NULL,
  `cardId` INT(11) NULL DEFAULT NULL,
  `cardType` VARCHAR(16) NULL DEFAULT NULL,
  `cardNumber` VARCHAR(32) NULL DEFAULT NULL,
  `cardOwnerName` VARCHAR(128) NULL DEFAULT NULL,
  `cardExpirationDate` VARCHAR(16) NULL DEFAULT NULL,
  `cardCVV` VARCHAR(8) NULL DEFAULT NULL,
  `billingLine1` VARCHAR(128) NULL DEFAULT NULL,
  `billingLine2` VARCHAR(128) NULL DEFAULT NULL,
  `billingCity` VARCHAR(64) NULL DEFAULT NULL,
  `billingState` VARCHAR(64) NULL DEFAULT NULL,
  `billingCountry` VARCHAR(64) NULL DEFAULT NULL,
  `billingZipcode` INT(11) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `modifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `orderId`
    FOREIGN KEY (`orderId`)
    REFERENCES `surprise`.`Order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Product` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Product` (
  `sku` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `occasion` VARCHAR(32) NOT NULL,
  `department` VARCHAR(16) NOT NULL COMMENT 'Home & Kitchen; Sports & Outdooors;\nElectronics; Books; Clothing, Shoes & Jewelry; Beauty & Personal Care; Toys & Games',
  `gender` INT(11) NOT NULL,
  `age` INT(11) NULL DEFAULT NULL COMMENT 'gender:  0 represents female, 1 represnet male, 2 represent undefined\nage uses integer to represent age period:  \"0(0-18), 1(18-25), 2(25-40), 3(>40)\"',
  `price` FLOAT NOT NULL,
  `subscribePrice` FLOAT NULL,
  `contents` VARCHAR(256) NULL DEFAULT NULL,
  `quantity` INT(11) NOT NULL,
  `picture` TEXT NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `sku_UNIQUE` (`sku` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1009
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Return`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Return` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Return` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `orderId` INT(11) NULL DEFAULT NULL,
  `productSKU` INT(11) NULL DEFAULT NULL,
  `lineItemId` INT(11) NULL DEFAULT NULL,
  `returnQuantity` INT(11) NULL DEFAULT NULL,
  `refundAmount` FLOAT NULL DEFAULT NULL,
  `refundCardId` INT(11) NULL DEFAULT NULL,
  `trackingNumber` VARCHAR(64) NULL DEFAULT NULL,
  `returnMethod` INT(11) NULL DEFAULT NULL COMMENT 'Drop off, pick up ',
  `response` VARCHAR(255) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  `receivedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `lineItemId`
    FOREIGN KEY (`lineItemId`)
    REFERENCES `surprise`.`LineItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Shipment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Shipment` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Shipment` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `orderId` INT(11) NULL DEFAULT NULL,
  `shippingMethod` VARCHAR(45) NULL DEFAULT NULL,
  `shippingCompany` VARCHAR(45) NULL DEFAULT NULL,
  `trackingNumber` VARCHAR(45) NULL DEFAULT NULL,
  `receiverName` VARCHAR(45) NULL DEFAULT NULL,
  `addressLine1` VARCHAR(45) NULL DEFAULT NULL,
  `addressLine2` VARCHAR(45) NULL DEFAULT NULL,
  `city` VARCHAR(64) NULL DEFAULT NULL,
  `state` VARCHAR(64) NULL DEFAULT NULL,
  `country` VARCHAR(64) NULL DEFAULT NULL,
  `zipcode` INT(11) NULL DEFAULT NULL,
  `telephone` VARCHAR(16) NULL DEFAULT NULL,
  `packedTime` DATETIME NULL DEFAULT NULL,
  `shippedTime` DATETIME NULL DEFAULT NULL,
  `deliveredTime` DATETIME NULL DEFAULT NULL,
  `estimatedTime` DATETIME NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`Subscription`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`Subscription` ;

CREATE TABLE IF NOT EXISTS `surprise`.`Subscription` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NULL DEFAULT NULL,
  `productSKU` INT(11) NULL DEFAULT NULL,
  `price` FLOAT NULL DEFAULT NULL,
  `quantity` INT(11) NULL DEFAULT NULL,
  `frequency` INT NULL DEFAULT NULL,
  `status` INT(11) NULL DEFAULT NULL,
  `nextOrderTime` DATETIME NULL DEFAULT NULL,
  `lastOrderTime` DATETIME NULL,
  `addressId` INT(11) NULL DEFAULT NULL,
  `cardId` INT(11) NULL DEFAULT NULL,
  `createdTime` DATETIME NULL DEFAULT NULL,
  `lastModifiedTime` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `customerId`
    FOREIGN KEY (`customerId`)
    REFERENCES `surprise`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`TaxRate`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`TaxRate` ;

CREATE TABLE IF NOT EXISTS `surprise`.`TaxRate` (
  `id` VARCHAR(16) NOT NULL,
  `rate` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `surprise`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `surprise`.`User` ;

CREATE TABLE IF NOT EXISTS `surprise`.`User` (
  `customerId` INT(11) NOT NULL COMMENT 'didn\'t set as FK, needs to write joints ourself.',
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`customerId`),
  UNIQUE INDEX `customerId_UNIQUE` (`customerId` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `surprise`.`Address`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Address` (`id`, `customerId`, `name`, `line1`, `line2`, `city`, `state`, `zipcode`, `country`, `telephone`, `isDefault`) VALUES (1, 1, 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 75080, 'US', '11112223333', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Admin`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Admin` (`id`, `name`, `email`, `password`, `role`, `createdTime`, `lastModifiedTime`) VALUES (1, 'Super Admin', 'super@admin.com', '1234', 'SUPER_ADMIN', '2017-01-01 00:00:01', '2017-01-01 00:00:01');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Card`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Card` (`id`, `customerId`, `type`, `name`, `cardNumber`, `line1`, `line2`, `city`, `state`, `zipcode`, `expirationDate`, `cvv`, `isDefault`) VALUES (1, 1, 'VISA', '3CPO R2', '4610460111112222', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 75080, '01/20', '123', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Customer`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Customer` (`id`, `email`, `firstName`, `middleName`, `lastName`, `createdTime`, `lastModifiedTime`) VALUES (1, 'test@test.com', '3CPO', '', 'R2', '2017-01-01 00:00:01', '2017-01-01 11:59:59');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`LineItem`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (1, 1, 6, 1, 1001, 1, 'Best Valentine Gife 1', 9.99, 1, '2017-03-26 20:26:23', '2017-03-26 20:35:22');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (2, 1, 4, 1, 1002, 1, 'Lovely Valentine Gife 2', 19.99, 1, '2017-03-26 20:26:23', '2017-03-26 20:37:37');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (3, 1, 1, 2, 1004, 2, 'Never Forget Valentine Gife 4', 19.99, 1, '2017-03-26 20:31:33', '2017-03-26 20:34:01');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (4, 1, 2, 3, 1006, 3, 'Lovely ESTER Gife 2', 19.99, 1, '2017-03-26 20:32:30', '2017-03-26 20:33:57');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (5, 1, 1, 4, 1007, 4, 'Best Family ESTER Gife 3', 39.99, 1, '2017-03-26 20:34:20', '2017-03-26 20:37:05');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (6, 1, 3, 5, 1001, 5, 'Best Valentine Gife 1', 9.99, 1, '2017-03-26 20:35:46', '2017-03-26 20:37:12');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (7, 1, 2, 6, 1008, 6, 'Happy ESTER Gife 4', 19.99, 1, '2017-03-26 20:35:57', '2017-03-26 20:36:54');
INSERT INTO `surprise`.`LineItem` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `shipmentId`, `productName`, `price`, `quantity`, `createdTime`, `lastModifiedTime`) VALUES (8, 1, 3, 7, 1003, 7, 'Luxury Valentine Gife 3', 39.99, 1, '2017-03-26 20:36:06', '2017-03-26 20:37:00');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Order`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (1, 1, 0, 1, 1, 29.98, 2.47335, 0.0825, 1, 2, '63619370-128c-11e7-8b1e-33daaa9e0395', '2017-03-26 20:26:23', '2017-03-26 20:26:23');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (2, 1, 0, 1, 1, 19.99, 1.64918, 0.0825, 1, 1, '1c408a90-128d-11e7-aabb-2d42664eba0f', '2017-03-26 20:31:33', '2017-03-26 20:31:33');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (3, 1, 0, 1, 1, 19.99, 1.64918, 0.0825, 1, 1, '3e893e80-128d-11e7-bd85-5142e5dff439', '2017-03-26 20:32:30', '2017-03-26 20:32:30');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (4, 1, 0, 1, 1, 39.99, 3.29918, 0.0825, 1, 1, '80412090-128d-11e7-bf5d-bff4c932bfcd', '2017-03-26 20:34:20', '2017-03-26 20:34:20');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (5, 1, 0, 1, 1, 9.99, 0.824175, 0.0825, 1, 1, 'b33f7aa0-128d-11e7-bf5d-bff4c932bfcd', '2017-03-26 20:35:46', '2017-03-26 20:35:46');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (6, 1, 0, 1, 1, 19.99, 1.64918, 0.0825, 1, 1, 'b9edd630-128d-11e7-bf5d-bff4c932bfcd', '2017-03-26 20:35:57', '2017-03-26 20:35:57');
INSERT INTO `surprise`.`Order` (`id`, `customerId`, `status`, `addressId`, `cardId`, `totalBeforeTax`, `tax`, `taxRate`, `shippingCost`, `lineItemCount`, `trackingNumber`, `createdTime`, `lastModifiedTime`) VALUES (7, 1, 0, 1, 1, 39.99, 3.29918, 0.0825, 1, 1, 'bf426e20-128d-11e7-bf5d-bff4c932bfcd', '2017-03-26 20:36:06', '2017-03-26 20:36:06');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`OrderPayment`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (1, 1, 0, 1, 33.4534, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:26:23', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (2, 1, 0, 2, 22.6392, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:31:33', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (3, 1, 0, 3, 22.6392, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:32:30', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (4, 1, 0, 4, 44.2892, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:34:20', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (5, 1, 0, 5, 11.8142, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:35:46', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (6, 1, 0, 6, 22.6392, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:35:57', NULL);
INSERT INTO `surprise`.`OrderPayment` (`id`, `customerId`, `status`, `orderId`, `amount`, `currencyType`, `cardId`, `cardType`, `cardNumber`, `cardOwnerName`, `cardExpirationDate`, `cardCVV`, `billingLine1`, `billingLine2`, `billingCity`, `billingState`, `billingCountry`, `billingZipcode`, `createdTime`, `modifiedTime`) VALUES (7, 1, 0, 7, 44.2892, 'USD', 1, 'VISA', '4610460111112222', '3CPO R2', '01/20', '123', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '2017-03-26 20:36:06', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Product`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1001, 'Best Valentine Gife 1', 'For you lover', 'VALENTINE_2017', 'Electronic', 1, 1, 9.99, 8.99, 'something in the box, that only clever guys can see.', 100, 'product_1.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1002, 'Lovely Valentine Gife 2', 'For you lover', 'VALENTINE_2017', 'Electronic', 1, 1, 19.99, 18.99, 'something in the box, that only clever guys can see.', 100, 'product_2.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1003, 'Luxury Valentine Gife 3', 'For you lover', 'VALENTINE_2017', 'Electronic', 0, 1, 39.99, 38.99, 'something in the box, that only clever guys can see.', 100, 'product_3.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1004, 'Never Forget Valentine Gife 4', 'For you lover', 'VALENTINE_2017', 'Handcraft', 0, 1, 19.99, 18.99, 'something in the box, that only clever guys can see.', 100, 'product_4.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1005, 'Funny ESTER Gife 1', 'For you kids', 'EASTER_2017', 'Handcraft', 1, 2, 9.99, 8.99, 'something in the box, that only clever guys can see.', 100, 'product_5.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1006, 'Lovely ESTER Gife 2', 'For you friends', 'EASTER_2017', 'Handcraft', 1, 2, 19.99, 18.99, 'something in the box, that only clever guys can see.', 100, 'product_6.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1007, 'Best Family ESTER Gife 3', 'For you family', 'EASTER_2017', 'Handcraft', 0, 2, 39.99, 38.99, 'something in the box, that only clever guys can see.', 100, 'product_7.jpg', NULL, NULL);
INSERT INTO `surprise`.`Product` (`sku`, `name`, `description`, `occasion`, `department`, `gender`, `age`, `price`, `subscribePrice`, `contents`, `quantity`, `picture`, `createdTime`, `lastModifiedTime`) VALUES (1008, 'Happy ESTER Gife 4', 'For everyone', 'EASTER_2017', 'Electronic', 0, 2, 19.99, 18.99, 'something in the box, that only clever guys can see.', 100, 'product_8.jpg', NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Return`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Return` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `lineItemId`, `returnQuantity`, `refundAmount`, `refundCardId`, `trackingNumber`, `returnMethod`, `response`, `createdTime`, `lastModifiedTime`, `receivedTime`) VALUES (1, 1, 2, 1, 1001, 1, 1, 10.7892, 1, '8c7b9ed0-128d-11e7-bf5d-bff4c932bfcd', 0, 'Bought by mistake', '2017-03-26 20:34:41', '2017-03-26 20:35:22', '2017-03-26 20:35:22');
INSERT INTO `surprise`.`Return` (`id`, `customerId`, `status`, `orderId`, `productSKU`, `lineItemId`, `returnQuantity`, `refundAmount`, `refundCardId`, `trackingNumber`, `returnMethod`, `response`, `createdTime`, `lastModifiedTime`, `receivedTime`) VALUES (2, 1, 0, 1, 1002, 2, 1, 21.5892, 1, 'f557f340-128d-11e7-bf5d-bff4c932bfcd', 0, 'Bought by mistake', '2017-03-26 20:37:37', '2017-03-26 20:37:37', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Shipment`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (1, 1, 3, 1, 'COURIER', 'UPS', '63622fb0-128c-11e7-8b1e-33daaa9e0395', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:33:16', '2017-03-26 20:33:19', '2017-03-26 20:33:50', '2017-03-28 20:33:19', '2017-03-26 20:26:23', '2017-03-26 20:33:50');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (2, 1, 1, 2, 'COURIER', 'UPS', '1c40ffc0-128d-11e7-aabb-2d42664eba0f', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:34:01', NULL, NULL, NULL, '2017-03-26 20:31:33', '2017-03-26 20:34:01');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (3, 1, 2, 3, 'COURIER', 'UPS', '3e898ca0-128d-11e7-bd85-5142e5dff439', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:33:12', '2017-03-26 20:33:57', NULL, '2017-03-28 20:33:57', '2017-03-26 20:32:30', '2017-03-26 20:33:57');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (4, 1, 1, 4, 'COURIER', 'UPS', '8041e3e0-128d-11e7-bf5d-bff4c932bfcd', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:37:05', NULL, NULL, NULL, '2017-03-26 20:34:20', '2017-03-26 20:37:05');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (5, 1, 3, 5, 'COURIER', 'UPS', 'b33fc8c0-128d-11e7-bf5d-bff4c932bfcd', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:37:11', '2017-03-26 20:37:12', '2017-03-26 20:37:12', '2017-03-28 20:37:12', '2017-03-26 20:35:46', '2017-03-26 20:37:12');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (6, 1, 2, 6, 'COURIER', 'UPS', 'b9ee7270-128d-11e7-bf5d-bff4c932bfcd', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:36:53', '2017-03-26 20:36:54', NULL, '2017-03-28 20:36:54', '2017-03-26 20:35:57', '2017-03-26 20:36:54');
INSERT INTO `surprise`.`Shipment` (`id`, `customerId`, `status`, `orderId`, `shippingMethod`, `shippingCompany`, `trackingNumber`, `receiverName`, `addressLine1`, `addressLine2`, `city`, `state`, `country`, `zipcode`, `telephone`, `packedTime`, `shippedTime`, `deliveredTime`, `estimatedTime`, `createdTime`, `lastModifiedTime`) VALUES (7, 1, 3, 7, 'COURIER', 'UPS', 'bf42bc40-128d-11e7-bf5d-bff4c932bfcd', 'R2', '800 W. Campbell Road', 'Richardson', 'Dallas', 'TX', 'Unitied States', 75080, '11112223333', '2017-03-26 20:36:57', '2017-03-26 20:36:58', '2017-03-26 20:37:00', '2017-03-28 20:36:58', '2017-03-26 20:36:06', '2017-03-26 20:37:00');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`Subscription`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`Subscription` (`id`, `customerId`, `productSKU`, `price`, `quantity`, `frequency`, `status`, `nextOrderTime`, `lastOrderTime`, `addressId`, `cardId`, `createdTime`, `lastModifiedTime`) VALUES (1, 1, 1004, 19.99, 1, 1, 1, '2017-04-26 20:26:32', NULL, 1, 1, '2017-03-26 20:26:32', '2017-03-26 20:31:33');
INSERT INTO `surprise`.`Subscription` (`id`, `customerId`, `productSKU`, `price`, `quantity`, `frequency`, `status`, `nextOrderTime`, `lastOrderTime`, `addressId`, `cardId`, `createdTime`, `lastModifiedTime`) VALUES (2, 1, 1006, 19.99, 1, 2, 1, '2017-04-26 20:26:40', NULL, 1, 1, '2017-03-26 20:26:40', '2017-03-26 20:32:30');

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`TaxRate`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`TaxRate` (`id`, `rate`) VALUES ('CA', 0.095);
INSERT INTO `surprise`.`TaxRate` (`id`, `rate`) VALUES ('OTHERS', 0.08);
INSERT INTO `surprise`.`TaxRate` (`id`, `rate`) VALUES ('TX', 0.0825);

COMMIT;


-- -----------------------------------------------------
-- Data for table `surprise`.`User`
-- -----------------------------------------------------
START TRANSACTION;
USE `surprise`;
INSERT INTO `surprise`.`User` (`customerId`, `password`) VALUES (1, 'test');

COMMIT;

