-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2025 at 07:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lc-clinic-db-2`
--

-- --------------------------------------------------------

--
-- Table structure for table `annual_physical_exams`
--

CREATE TABLE `annual_physical_exams` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bp` varchar(20) DEFAULT NULL,
  `temp` varchar(10) DEFAULT NULL,
  `heart_rate` varchar(10) DEFAULT NULL,
  `rr` varchar(10) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `bmi` varchar(10) DEFAULT NULL,
  `asthma` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `medical_condition` text DEFAULT NULL,
  `vision_od` varchar(20) DEFAULT NULL,
  `vision_os` varchar(20) DEFAULT NULL,
  `hearing_right` varchar(20) DEFAULT NULL,
  `hearing_left` varchar(20) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `assessment` enum('Normal','With Limitations','Needs Attention') DEFAULT NULL,
  `recommendation` text DEFAULT NULL,
  `date_examined` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `annual_physical_exams`
--

INSERT INTO `annual_physical_exams` (`id`, `user_id`, `bp`, `temp`, `heart_rate`, `rr`, `height`, `weight`, `bmi`, `asthma`, `allergies`, `medical_condition`, `vision_od`, `vision_os`, `hearing_right`, `hearing_left`, `remarks`, `assessment`, `recommendation`, `date_examined`, `created_at`) VALUES
(1, 1, '130/20', '37', '37', '35', '13', '12', '13', '13', '13', '13', '13', '13', '13', '13', 'Remarks', 'Normal', 'Remarks', '2025-04-23 16:00:00', '2025-04-24 09:39:53'),
(2, 1, '190/80', '12', '12', '12', '12', '13', '12', 'Yes', 'Yes', 'Yes', 'Yes', 'No', ' Yes', ' Yes', 'Remarks', 'Normal', 'Test Recommendation', '2025-04-24 09:40:57', '2025-04-26 09:39:39'),
(3, 8, 'sda', 'asd', 'asd', 'asd', 'asd', 'asdsa', 'asd', 'asdsa', 'asds', 'asdsa', 'sadsa', 'asdsa', 'asdsa', 'asdas', 'asdsa', 'Normal', 'sadasd', '2025-04-27 13:34:42', '2025-04-27 13:34:42'),
(5, 17, 'b', 'b', 'b', 'b', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'Normal', 'a', '2025-04-27 13:48:42', '2025-04-27 13:48:42'),
(6, 15, 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'With Limitations', 'b', '2025-04-27 13:50:21', '2025-04-27 13:50:21'),
(7, 18, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'Normal', 'a', '2025-04-27 15:50:21', '2025-04-27 15:50:21'),
(8, 27, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'Normal', 'a', '2025-04-27 15:52:38', '2025-04-27 15:52:38');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `complaint` text NOT NULL,
  `status` enum('pending','completed','canceled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `date`, `time`, `complaint`, `status`, `created_at`) VALUES
(1, 1, '2025-04-29', '13:30:00', 'headache', 'canceled', '2025-04-23 11:43:53'),
(2, 1, '2025-04-29', '16:00:00', 'adaad', 'pending', '2025-04-26 06:03:26'),
(3, 1, '2025-04-28', '08:30:00', 'Test', 'canceled', '2025-04-27 01:57:29'),
(4, 1, '2025-04-29', '13:00:00', 'Check ', 'pending', '2025-04-27 01:58:20'),
(5, 1, '2025-04-29', '12:00:00', 'asasdas', 'completed', '2025-04-27 02:12:41'),
(6, 3, '2025-04-28', '09:00:00', 'Headache', 'completed', '2025-04-27 07:02:24'),
(7, 14, '2025-04-28', '09:00:00', 'asdasd', 'completed', '2025-04-27 14:07:51'),
(8, 13, '2025-04-28', '13:00:00', 'test', 'pending', '2025-04-27 14:41:37'),
(9, 26, '2025-04-28', '11:30:00', 'test', 'completed', '2025-04-27 15:06:07'),
(10, 26, '2025-04-28', '11:00:00', 'test', 'canceled', '2025-04-27 15:25:01'),
(11, 27, '2025-05-09', '13:00:00', 'test', 'pending', '2025-04-27 15:26:20'),
(12, 26, '2025-04-30', '15:30:00', 'Masakit ulo', 'pending', '2025-04-27 17:17:17');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_inventory`
--

CREATE TABLE `equipment_inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `january` varchar(100) DEFAULT NULL,
  `february` varchar(100) DEFAULT NULL,
  `march` varchar(100) DEFAULT NULL,
  `april` varchar(100) DEFAULT NULL,
  `may` varchar(100) DEFAULT NULL,
  `june` varchar(100) DEFAULT NULL,
  `july` varchar(100) DEFAULT NULL,
  `august` varchar(100) DEFAULT NULL,
  `september` varchar(100) DEFAULT NULL,
  `october` varchar(100) DEFAULT NULL,
  `november` varchar(100) DEFAULT NULL,
  `december` varchar(100) DEFAULT NULL,
  `year` year(4) NOT NULL,
  `remarks` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_inventory`
--

INSERT INTO `equipment_inventory` (`id`, `name`, `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`, `year`, `remarks`, `last_updated`, `archived`) VALUES
(1, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:20:50', 1),
(2, 'Test Equipment', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2025', '', '2025-04-27 09:24:42', 1),
(3, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:24:43', 1),
(4, 'sad', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', 'asdsad', '2025-04-27 09:25:37', 1),
(5, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:25:38', 1),
(6, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:25:38', 1),
(7, '', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '121', '2025', '', '2025-04-27 09:26:11', 1),
(8, '', '0', '0', '0', '0', '0', '0', '0', '1', '0', '10', '0', '0', '2025', '', '2025-04-27 09:40:43', 1),
(9, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:40:43', 1),
(10, '1', '0', '0', '0', '0', '0', '0', '0', '100', '0', '0', '0', '0', '2025', '', '2025-04-27 17:30:45', 0);

-- --------------------------------------------------------

--
-- Table structure for table `medicine_inventory`
--

CREATE TABLE `medicine_inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `january` varchar(100) DEFAULT NULL,
  `february` varchar(100) DEFAULT NULL,
  `march` varchar(100) DEFAULT NULL,
  `april` varchar(100) DEFAULT NULL,
  `may` varchar(100) DEFAULT NULL,
  `june` varchar(100) DEFAULT NULL,
  `july` varchar(100) DEFAULT NULL,
  `august` varchar(100) DEFAULT NULL,
  `september` varchar(100) DEFAULT NULL,
  `october` varchar(100) DEFAULT NULL,
  `november` varchar(100) DEFAULT NULL,
  `december` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `year` year(4) NOT NULL,
  `remarks` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicine_inventory`
--

INSERT INTO `medicine_inventory` (`id`, `name`, `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`, `expiry_date`, `year`, `remarks`, `last_updated`, `archived`) VALUES
(1, 'Test Item', '1', '0', '0', '0', '20', '1', '1', '1', '1', '0', '6', '1', NULL, '2024', 'test', '2025-04-27 09:55:31', 1),
(2, '', '0', '0', '0', '0', '0', '1', '1', '0', '0', '0', '200', '100', NULL, '2025', '', '2025-04-27 09:06:04', 1),
(3, '', '0', '0', '0', '0', '0', '100', '200', '0', '0', '0', '0', '0', NULL, '2025', '', '2025-04-27 09:05:54', 1),
(4, '', '0', '0', '0', '0', '0', '1', '0', '0', '0', '0', '0', '0', NULL, '2025', '', '2025-04-27 09:55:31', 1),
(5, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', NULL, '2025', '', '2025-04-27 09:55:32', 1),
(6, 'Test', '1', '1', '1', '1', '1', '1', '1', '10', '10', '1', '1', '10', NULL, '2025', '', '2025-04-27 17:34:27', 1),
(7, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', NULL, '2025', '', '2025-04-27 17:34:27', 1),
(8, 'a', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025-04-29', '2025', '', '2025-04-27 17:36:14', 0);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `created_at`) VALUES
(19, 'Appointment Completed', 'An appointment has been completed.', '2025-04-27 23:16:57'),
(20, 'Appointment Updated', 'An appointment has been updated.', '2025-04-27 23:24:45'),
(21, 'New Appointment Scheduled', 'A new appointment has been booked.', '2025-04-27 23:25:01'),
(22, 'Appointment Updated', 'An appointment has been updated.', '2025-04-27 23:25:57'),
(23, 'New Appointment Scheduled', 'A new appointment has been booked.', '2025-04-27 23:26:20'),
(24, 'Appointment Updated', 'An appointment has been updated.', '2025-04-27 23:34:01'),
(25, 'Annual Physical Exam Created', 'An annual physical exam record has been created for a student (User ID: 18).', '2025-04-27 23:50:21'),
(26, 'Annual Physical Exam Created', 'An annual physical exam record has been created for a student (User ID: 27).', '2025-04-27 23:52:38'),
(27, 'Appointment Canceled', 'An appointment has been canceled.', '2025-04-27 23:52:53'),
(28, 'New Student Consultation Log', 'A new consultation entry has been logged for a student (User ID: 26).', '2025-04-28 00:43:21'),
(29, 'New Appointment Scheduled', 'A new appointment has been booked.', '2025-04-28 01:17:17'),
(30, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:17:24'),
(31, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:17:49'),
(32, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:18:28'),
(33, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:18:37'),
(34, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:18:43'),
(35, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:19:48'),
(36, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:20:00'),
(37, 'Appointment Updated', 'An appointment has been updated.', '2025-04-28 01:20:16');

-- --------------------------------------------------------

--
-- Table structure for table `notification_receivers`
--

CREATE TABLE `notification_receivers` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_receivers`
--

INSERT INTO `notification_receivers` (`id`, `notification_id`, `user_id`, `is_read`, `read_at`) VALUES
(1, 19, 1, 1, NULL),
(2, 19, 10, 0, NULL),
(3, 19, 12, 0, NULL),
(4, 20, 1, 1, NULL),
(5, 20, 10, 0, NULL),
(6, 20, 12, 0, NULL),
(7, 21, 1, 1, NULL),
(8, 21, 10, 0, NULL),
(9, 21, 12, 0, NULL),
(10, 21, 26, 1, NULL),
(11, 22, 1, 1, NULL),
(12, 22, 10, 0, NULL),
(13, 22, 12, 0, NULL),
(14, 22, 26, 1, NULL),
(15, 23, 1, 1, NULL),
(16, 23, 10, 0, NULL),
(17, 23, 12, 0, NULL),
(18, 23, 27, 0, NULL),
(19, 24, 1, 1, NULL),
(20, 24, 10, 0, NULL),
(21, 24, 12, 0, NULL),
(22, 25, 1, 1, NULL),
(23, 25, 10, 0, NULL),
(24, 25, 12, 0, NULL),
(25, 25, 18, 0, NULL),
(26, 26, 1, 1, NULL),
(27, 26, 10, 0, NULL),
(28, 26, 12, 0, NULL),
(29, 26, 27, 0, NULL),
(30, 27, 1, 1, NULL),
(31, 27, 10, 0, NULL),
(32, 27, 12, 0, NULL),
(33, 27, 26, 1, NULL),
(34, 28, 1, 1, NULL),
(35, 28, 10, 0, NULL),
(36, 28, 12, 0, NULL),
(37, 28, 26, 1, NULL),
(38, 29, 1, 1, NULL),
(39, 29, 10, 0, NULL),
(40, 29, 12, 0, NULL),
(41, 29, 26, 1, NULL),
(42, 30, 1, 1, NULL),
(43, 30, 10, 0, NULL),
(44, 30, 12, 0, NULL),
(45, 30, 26, 1, NULL),
(46, 31, 1, 1, NULL),
(47, 31, 10, 0, NULL),
(48, 31, 12, 0, NULL),
(49, 31, 26, 1, NULL),
(50, 32, 1, 1, NULL),
(51, 32, 10, 0, NULL),
(52, 32, 12, 0, NULL),
(53, 32, 26, 1, NULL),
(54, 33, 1, 1, NULL),
(55, 33, 10, 0, NULL),
(56, 33, 12, 0, NULL),
(57, 33, 26, 1, NULL),
(58, 34, 1, 1, NULL),
(59, 34, 10, 0, NULL),
(60, 34, 12, 0, NULL),
(61, 34, 26, 1, NULL),
(62, 35, 1, 1, NULL),
(63, 35, 10, 0, NULL),
(64, 35, 12, 0, NULL),
(65, 36, 1, 1, NULL),
(66, 36, 10, 0, NULL),
(67, 36, 12, 0, NULL),
(68, 37, 1, 1, NULL),
(69, 37, 10, 0, NULL),
(70, 37, 12, 0, NULL),
(71, 37, 26, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personel`
--

CREATE TABLE `personel` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `physical_exam_findings`
--

CREATE TABLE `physical_exam_findings` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `body_part` varchar(50) DEFAULT NULL,
  `status` enum('N','NA','A') DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `physical_exam_findings`
--

INSERT INTO `physical_exam_findings` (`id`, `exam_id`, `body_part`, `status`, `notes`) VALUES
(4, 5, 'Nose', 'N', 'a'),
(5, 5, 'Mouth', 'N', 'a'),
(6, 5, 'Feet', 'A', 'a'),
(7, 6, 'Skin', 'N', 'b'),
(8, 6, 'Rectum', 'N', 'b'),
(9, 6, 'Gums', 'A', 'b'),
(10, 6, 'Feet', 'A', 'b'),
(11, 7, 'Skin', 'N', 'a'),
(12, 7, 'Lungs', 'N', 'a'),
(13, 7, 'Nose', 'N', 'a'),
(14, 8, 'Skin', 'A', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `prescription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prescribed_by` int(11) NOT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`prescription_id`, `user_id`, `prescribed_by`, `medicine_name`, `dosage`, `frequency`, `duration`, `notes`, `created_at`) VALUES
(1, 1, 1, '1', '1', '1', '1', '1', '2025-04-27 05:00:45'),
(2, 1, 1, '1', '1', '1', '1', '1', '2025-04-27 05:00:45'),
(3, 1, 1, '2', '2', '2', '2', '2', '2025-04-27 05:17:20'),
(4, 1, 1, '2', '2', '2', '2', '2', '2025-04-27 05:17:20'),
(5, 1, 1, '2', '2', '2', '2', '2', '2025-04-27 05:17:20');

-- --------------------------------------------------------

--
-- Table structure for table `prescription_headers`
--

CREATE TABLE `prescription_headers` (
  `prescription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prescribed_by` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescription_headers`
--

INSERT INTO `prescription_headers` (`prescription_id`, `user_id`, `prescribed_by`, `notes`, `created_at`) VALUES
(1, 1, 1, 'For headache', '2025-04-27 13:33:14'),
(2, 1, 1, 'Medicines', '2025-04-27 13:34:27'),
(3, 3, 1, 'Test notes', '2025-04-27 15:03:05'),
(4, 18, 1, 'sadsaddsa', '2025-04-27 21:33:43'),
(5, 17, 1, 'a', '2025-04-27 21:49:37'),
(6, 26, 1, 'a', '2025-04-28 00:43:37');

-- --------------------------------------------------------

--
-- Table structure for table `prescription_medicines`
--

CREATE TABLE `prescription_medicines` (
  `medicine_id` int(11) NOT NULL,
  `prescription_id` int(11) NOT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `duration` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescription_medicines`
--

INSERT INTO `prescription_medicines` (`medicine_id`, `prescription_id`, `medicine_name`, `dosage`, `frequency`, `duration`) VALUES
(1, 1, 'Paracetamol', '500mg', '3', '7'),
(2, 2, 'Medicines', '500mg', '3', '10'),
(3, 2, 'Paracetamol', '400mg', '7', '4'),
(4, 2, 'Test', '600mg', '6', '8'),
(5, 3, 'Test', '500mg', '4', '7'),
(6, 4, 'ads', 'asd', 'asda', 'sadsa'),
(7, 5, 'a', 'a', 'a', 'a'),
(8, 6, 'a', 'a', 'a', 'a'),
(9, 6, 'b', 'b', 'b', 'b'),
(10, 6, 'c', 'c', 'c', 'c');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `course` varchar(200) NOT NULL,
  `year` varchar(100) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `sex` enum('Male','Female','Other') DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_person_number` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `full_name`, `course`, `year`, `birthdate`, `sex`, `contact_number`, `email`, `address`, `contact_person`, `contact_person_number`, `created_at`) VALUES
(1, 1, '112245', 'John Doe', '', '', '2005-04-15', 'Male', '12345678990', 'john.doe@gmail.com', 'San Fernando La Union', '', '', '2025-04-22 22:29:57'),
(2, 3, '112246', 'Jane Smith', 'BSCS', '3rd Year', '2004-04-15', 'Female', '12345678990', 'jane.smith@gmail.com', 'Address', 'Address', 'Address', '2025-04-27 14:43:44'),
(3, 4, '112347', 'Joerge Smith', 'BSIT', '2nd Year', '2004-04-21', 'Male', '12345678999', 'joerge@gmail.com', 'SFC', 'Jane Smith', '12345678900', '2025-04-27 14:51:12'),
(4, 14, '5111', 'Gelo Bee', 'BSCS', '2nd Year', '2004-04-27', 'Male', '123456789', 'gelobee1@gmail.com', 'Address', 'Emergency Contact Person', 'Address', '2025-04-27 19:20:07'),
(5, 15, '123453', 'Gelobee', 'BSIT', '1st Year', '2000-04-02', 'Male', '12345123451', 'gelobee2@gmail.com', 'Address', 'Contact', 'Contact', '2025-04-27 19:25:50'),
(6, 16, '123456789', 'Test user', 'BSIT', '1st Year', '2004-04-12', 'Male', 'Contact Number', 'testuser6@gmail.com', 'Address', 'Emergency Contact Person', 'Emergency Contact Pe', '2025-04-27 19:30:02'),
(7, 17, '112247', 'Full name', '12345', '2nd Year', '2025-04-21', 'Male', 'asdas', 'gelobee@gmail.com', 'sadsad', 'sadsa', 'sadsad', '2025-04-27 19:31:45'),
(8, 18, '12345678', 'Test 2025', 'BSIT', '1st Year', '2025-04-29', 'Male', '123456789', 'test2025@gmail.com', 'Address', 'Contact Person', 'Contact Person Numbe', '2025-04-27 21:26:03'),
(9, 26, '1234567891', 'Unknow Unknow', 'BSIT', '4th Year', '2000-04-27', 'Male', '123456789', 'goldenmelon777@gmail.com', 'San Fernando La Union', '123456789', '123456789', '2025-04-27 23:05:51'),
(10, 27, NULL, 'Unknow User', '', '', NULL, NULL, NULL, 'cabase.1324@gmail.com', NULL, NULL, NULL, '2025-04-27 23:25:28');

-- --------------------------------------------------------

--
-- Table structure for table `student_logs`
--

CREATE TABLE `student_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `chief_complaint` text DEFAULT NULL,
  `intervention` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_logs`
--

INSERT INTO `student_logs` (`id`, `user_id`, `date`, `time`, `chief_complaint`, `intervention`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-04-26', '18:11:58', 'sample', 'Test', 'Test', '2025-04-26 10:11:58', '2025-04-26 10:11:58'),
(2, 1, '2025-04-26', '18:14:03', 'Test ', 'Intervention', 'Remarks', '2025-04-26 10:14:03', '2025-04-26 10:14:03'),
(3, 1, '2025-04-26', '18:15:48', '123123123', 'asdsaasdadadaddaasdadadadadsa', 'asdsda', '2025-04-26 10:15:48', '2025-04-26 12:29:50'),
(4, 1, '2025-04-26', '20:36:49', 'adaad', 'test', 'test', '2025-04-26 12:36:49', '2025-04-26 12:36:49'),
(5, 3, '2025-04-27', '15:02:49', 'Headache', 'Test Intervention', 'Remarks', '2025-04-27 07:02:49', '2025-04-27 07:02:49'),
(9, 18, '2025-04-27', '21:33:29', 'test', 'test', 'test', '2025-04-27 13:33:29', '2025-04-27 13:33:29'),
(10, 17, '2025-04-27', '21:49:32', 'a', 'a', 'a', '2025-04-27 13:49:32', '2025-04-27 13:49:32'),
(11, 14, '2025-04-27', '22:08:05', 'asdasd', 'aaa', 'aaa', '2025-04-27 14:08:05', '2025-04-27 14:08:05'),
(12, 26, '2025-04-28', '00:43:21', 'aaa', 'aaa', 'aaa', '2025-04-27 16:43:21', '2025-04-27 16:43:21');

-- --------------------------------------------------------

--
-- Table structure for table `supply_inventory`
--

CREATE TABLE `supply_inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `january` varchar(100) DEFAULT NULL,
  `february` varchar(100) DEFAULT NULL,
  `march` varchar(100) DEFAULT NULL,
  `april` varchar(100) DEFAULT NULL,
  `may` varchar(100) DEFAULT NULL,
  `june` varchar(100) DEFAULT NULL,
  `july` varchar(100) DEFAULT NULL,
  `august` varchar(100) DEFAULT NULL,
  `september` varchar(100) DEFAULT NULL,
  `october` varchar(100) DEFAULT NULL,
  `november` varchar(100) DEFAULT NULL,
  `december` varchar(100) DEFAULT NULL,
  `year` year(4) NOT NULL,
  `remarks` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supply_inventory`
--

INSERT INTO `supply_inventory` (`id`, `name`, `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`, `year`, `remarks`, `last_updated`, `archived`) VALUES
(1, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:35:16', 1),
(2, 'asdsa', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:38:24', 1),
(3, 'sadsa', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:38:23', 1),
(4, 'sadasd', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:38:23', 1),
(5, '', '0', '0', '112121', '21212', '0', '12121', '0', '1212120', '0', '12121', '0', '12121', '2025', '', '2025-04-27 09:38:23', 1),
(6, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 09:38:23', 1),
(7, '', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 10:34:15', 1),
(8, 'asdasd', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 17:39:02', 0),
(9, 'asdsad', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 17:39:05', 0),
(10, 'aaaa', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '2025', '', '2025-04-27 17:39:07', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('Admin','Physician','Staff','Student') DEFAULT 'Student',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `image_url`, `username`, `password`, `name`, `email`, `role`, `status`, `created_at`) VALUES
(1, 'profile/1745767540876.jpg', 'Admin', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'Angelo Cabase', 'gelocabase1324@gmail.com', 'Admin', 1, '2025-04-22 22:08:15'),
(3, '', 'jane.smith@gmail.com', '', 'Jane Smith', 'jane.smith@gmail.com', 'Student', 1, '2025-04-27 14:43:44'),
(4, '', 'joerge@gmail.com', '', 'Joerge Smith', 'joerge@gmail.com', 'Student', 1, '2025-04-27 14:51:12'),
(5, NULL, 'test@gmail.com', '$2b$10$m7FleE1SAInTngws8g2Vo.djVS22aNRT3/YG2k6bhatHZBkQamxEi', 'Test', 'test@gmail.com', 'Physician', 1, '2025-04-27 18:00:13'),
(8, NULL, 'test5@gmail.com', '$2b$10$0z1Jm8.H2sVHUCVJFbDJAOuOkhU5XtHjSgUTPKVhXEspLKvGuuyBO', 'Test', 'test5@gmail.com', 'Student', 1, '2025-04-27 18:05:32'),
(9, NULL, 'testuser@gmail.com', '$2b$10$3gXR79gJTq5E.eqYphlBZ.Fg.GEkrT51BAdFN4VgZ.e88Bj5kFYiy', 'Test User', 'testuser@gmail.com', 'Student', 1, '2025-04-27 18:06:52'),
(10, NULL, 'testuser2@gmail.com', '$2b$10$du4kSkCLMH5SGwlNc6vdgONnvN0JxaesunRQC6f/PmC9Why8yYHs.', 'Test User 2', 'testuser2@gmail.com', 'Staff', 1, '2025-04-27 18:08:01'),
(11, NULL, 'testuser3@gmail.com', '$2b$10$9ZSg662LPbQBu6m04rkKEeia3ptl/P9o3/ufelMMwUtFh5UvBl5IC', 'test user 2', 'testuser3@gmail.com', 'Physician', 1, '2025-04-27 18:10:25'),
(12, NULL, 'sadsad@gmail.com', '$2b$10$m7FleE1SAInTngws8g2Vo.djVS22aNRT3/YG2k6bhatHZBkQamxEi', 'asdsa', 'sadsad@gmail.com', 'Staff', 1, '2025-04-27 18:10:46'),
(13, 'profile/1745749886123.jpg', '1111111111', '', 'Unknow Unknow', 'goldenmelon777@gmail.com1', 'Student', 1, '2025-04-27 18:31:26'),
(14, NULL, 'gebee', '$2b$10$XLzdhLp4LXR6PYdUHmJG3uPOQmcErEg5gX5AQXjoqFLbp.BFpPGY2', 'Gelo Bee', 'gelobee1@gmail.com', 'Student', 1, '2025-04-27 19:20:07'),
(15, NULL, 'gelobee2@gmail.com', '$2b$10$XLzdhLp4LXR6PYdUHmJG3uPOQmcErEg5gX5AQXjoqFLbp.BFpPGY2', 'Gelobee', 'gelobee2@gmail.com', 'Student', 1, '2025-04-27 19:25:50'),
(16, NULL, '1', '$2b$10$nMcn5NqlIngpJ3s04bksWOapgIuDMXkEiLVDLMZBcszndZoiHk6dG', 'Test user', 'testuser6@gmail.com', 'Student', 1, '2025-04-27 19:30:02'),
(17, NULL, '1212', '$2b$10$YHiFGrjvCmJt1rEO662VpOvcWX2NJjpeafw64NLa0Di/xO.3SVuDi', 'Full name', 'gelobee@gmail.com', 'Student', 1, '2025-04-27 19:31:45'),
(18, NULL, 'test2025', '$2b$10$faTqBiPYZ81coMi8v.xnROb1gVcNXDS60m0FXOyt1XQNZCUbfRcXC', 'Test 2025', 'test2025@gmail.com', 'Student', 1, '2025-04-27 21:26:03'),
(26, 'profile/1745766351133.jpg', 'testing ', '', 'Unknow Unknow', 'goldenmelon777@gmail.com', 'Student', 1, '2025-04-27 23:05:51'),
(27, 'profile/1745767528656.jpg', 'cabase.1324@gmail.com', '', 'Unknow User', 'cabase.1324@gmail.com', 'Student', 1, '2025-04-27 23:25:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `annual_physical_exams`
--
ALTER TABLE `annual_physical_exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `equipment_inventory`
--
ALTER TABLE `equipment_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicine_inventory`
--
ALTER TABLE `medicine_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_id` (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `personel`
--
ALTER TABLE `personel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`prescription_id`),
  ADD KEY `fk_prescription_user` (`user_id`);

--
-- Indexes for table `prescription_headers`
--
ALTER TABLE `prescription_headers`
  ADD PRIMARY KEY (`prescription_id`);

--
-- Indexes for table `prescription_medicines`
--
ALTER TABLE `prescription_medicines`
  ADD PRIMARY KEY (`medicine_id`),
  ADD KEY `prescription_id` (`prescription_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_logs`
--
ALTER TABLE `student_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `supply_inventory`
--
ALTER TABLE `supply_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `annual_physical_exams`
--
ALTER TABLE `annual_physical_exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `equipment_inventory`
--
ALTER TABLE `equipment_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `medicine_inventory`
--
ALTER TABLE `medicine_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `personel`
--
ALTER TABLE `personel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `prescription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `prescription_headers`
--
ALTER TABLE `prescription_headers`
  MODIFY `prescription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `prescription_medicines`
--
ALTER TABLE `prescription_medicines`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `student_logs`
--
ALTER TABLE `student_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `supply_inventory`
--
ALTER TABLE `supply_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `annual_physical_exams`
--
ALTER TABLE `annual_physical_exams`
  ADD CONSTRAINT `annual_physical_exams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_receivers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `personel`
--
ALTER TABLE `personel`
  ADD CONSTRAINT `personel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  ADD CONSTRAINT `physical_exam_findings_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `annual_physical_exams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `fk_prescription_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescription_medicines`
--
ALTER TABLE `prescription_medicines`
  ADD CONSTRAINT `prescription_medicines_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescription_headers` (`prescription_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_logs`
--
ALTER TABLE `student_logs`
  ADD CONSTRAINT `fk_student_logs_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
