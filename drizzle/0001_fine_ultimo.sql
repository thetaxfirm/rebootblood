CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`actorOpenId` varchar(64),
	`actorName` text,
	`action` varchar(64) NOT NULL,
	`targetType` varchar(32) NOT NULL,
	`targetId` varchar(64),
	`detail` text,
	`ipHash` varchar(64),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`encryptedPayload` text NOT NULL,
	`source` varchar(64) NOT NULL DEFAULT 'lead_form',
	`treatmentInterest` enum('eboo','plasmapheresis','both','unsure') NOT NULL DEFAULT 'unsure',
	`status` enum('new','reviewing','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
	`consentContact` boolean NOT NULL DEFAULT false,
	`submittedIpHash` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_publicId_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `questionnaire_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`encryptedPayload` text NOT NULL,
	`treatmentInterest` enum('eboo','plasmapheresis','both','unsure') NOT NULL DEFAULT 'unsure',
	`status` enum('new','reviewing','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
	`consentTreatmentInfo` boolean NOT NULL DEFAULT false,
	`consentPrivacy` boolean NOT NULL DEFAULT false,
	`consentContact` boolean NOT NULL DEFAULT false,
	`submittedIpHash` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questionnaire_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `questionnaire_submissions_publicId_unique` UNIQUE(`publicId`)
);
