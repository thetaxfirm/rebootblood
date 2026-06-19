CREATE TABLE `tier_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tier` varchar(120) NOT NULL,
	`treatmentInterest` enum('eboo','plasmapheresis','both','unsure') NOT NULL DEFAULT 'unsure',
	`action` enum('book','check_eligibility') NOT NULL,
	`sourcePath` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tier_events_id` PRIMARY KEY(`id`)
);
