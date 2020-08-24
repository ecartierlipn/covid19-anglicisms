-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: covid19
-- ------------------------------------------------------
-- Server version	5.7.31-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `concepts`
--

DROP TABLE IF EXISTS `concepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concepts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `en_lexemes` varchar(255),
  `cs_def` text,
  `da_def` text,
  `de_def` text,
  `en_def` text,
  `es_def` text,
  `fi_def` text,
  `fr_def` text,
  `it_def` text,
  `nl_def` text,
  `is_def` text,
  `no_def` text,
  `pt_def` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `concepts_domains`
--

DROP TABLE IF EXISTS `concepts_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concepts_domains` (
  `id_concept` int(11) DEFAULT NULL,
  `id_domain` int(11) DEFAULT NULL,
  UNIQUE KEY `id_concept` (`id_concept`,`id_domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `concepts_relations`
--

DROP TABLE IF EXISTS `concepts_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concepts_relations` (
  `id_concept1` int(11) DEFAULT NULL,
  `id_concept2` int(11) DEFAULT NULL,
  `relation` int(11) DEFAULT NULL,
  UNIQUE KEY `id_concept1` (`id_concept1`,`id_concept2`,`relation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id` varchar(255) NOT NULL,
  `label` varchar(255),
  `level` int(11) DEFAULT NULL,
  `parent` varchar(255),
  `label_var` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` varchar(255) NOT NULL,
  `label` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lexemes`
--

DROP TABLE IF EXISTS `lexemes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lexemes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` varchar(255),
  `query` varchar(255),
  `id_concept` int(11) DEFAULT NULL,
  `lang` varchar(255),
  `type` int(11) DEFAULT NULL,
  `context` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8227355 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lexemes_types`
--

DROP TABLE IF EXISTS `lexemes_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lexemes_types` (
  `id` int(11) DEFAULT NULL,
  `label` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(45) NOT NULL,
  `joining_date` datetime NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `language` int(11) NOT NULL,
  `user_rights` int(11) NOT NULL,
  `rights_corpus` int(11) NOT NULL,
  `rights_corpus_params` int(11) NOT NULL,
  `rights_dict` int(11) NOT NULL,
  `rights_neoform` int(11) NOT NULL,
  `rights_neoform_params` int(11) NOT NULL,
  `rights_neosem` int(11) NOT NULL,
  `rights_neosem_params` int(11) NOT NULL,
  `rights_neodb` int(11) NOT NULL,
  `rights_neodb_params` int(11) NOT NULL,
  `rights_users` int(11) NOT NULL,
  `last_visit` datetime DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-23 12:46:45
