-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2025 at 04:04 AM
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
-- Database: `lc-clinic-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `annual_physical_exams`
--

CREATE TABLE `annual_physical_exams` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
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
  `date_examined` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 1, '2025-04-24', '09:00:00', 'headache', 'pending', '2025-04-23 11:43:53');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
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
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `student_id`, `full_name`, `birthdate`, `sex`, `contact_number`, `email`, `address`, `contact_person`, `contact_person_number`, `created_at`) VALUES
(1, '112245', 'John Doe', '2005-04-14', 'Male', NULL, 'john.doe@gmail.com', 'San Fernando La Union', '', '', '2025-04-22 22:29:57');

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

-- --------------------------------------------------------

--
-- Table structure for table `physicians`
--

CREATE TABLE `physicians` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','physician','staff') DEFAULT 'staff',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `image_url`, `username`, `password`, `name`, `email`, `role`, `status`, `created_at`) VALUES
(1, '', 'Admin', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'Angelo Cabase', 'gelocabase1324@gmail.com', 'admin', 1, '2025-04-22 22:08:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `annual_physical_exams`
--
ALTER TABLE `annual_physical_exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `physicians`
--
ALTER TABLE `physicians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `physicians`
--
ALTER TABLE `physicians`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `annual_physical_exams`
--
ALTER TABLE `annual_physical_exams`
  ADD CONSTRAINT `annual_physical_exams_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `physical_exam_findings`
--
ALTER TABLE `physical_exam_findings`
  ADD CONSTRAINT `physical_exam_findings_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `annual_physical_exams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `physicians`
--
ALTER TABLE `physicians`
  ADD CONSTRAINT `physicians_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
