TutorHub API

This is an API for a tutorial centre where tutors and students can meet up with each other and book lessons.

There are four types of User in this API:
Super Admin
Admin
Tutor
Student

There would be three categories:
Primary
JSS
SSS

Categories User Story:
The category represents normal school classes. Under each category, there would be subjects (e.g mathematics).
Category schema
Id
Name
Description
createdAt
updatedAt
Each category will have different subject under it (hint: One to many relationship)
When a category is deleted, all subjects under the category must be deleted too (hint: mongodb hooks (e.g pre, post).

Subject User Story:
Subject Schema
Id
Category ( foreign key)
title
Description
Duration (number of hours for the subject)
createdAt
updatedAt
Tutors (array of foreign keys of tutors)
(you can update according to needs)

Super Admin User Story:
The Super Admin can be created directly in the database (hint: you can use a hash of a password you know before for the password field when creating directly in the database).
No one can register to be an admin. And only the created super_admin in the database can exit.
Super admin can login using username and password
Super admin can create an admin using a default password that would be changed by the created admin when he logs in. (Not so important that the created admin changes password, not the bone of contention here).
Can get all admins
Can deactivate an admin ( a deactivated admin will not be able to login but the account exists). You can send a 403 response when a deactivated admin tries to login
Sample response
{
“status”: 403,
“error”: “Account deactivated, permission denied”
}

Super admin have all admin privileges

Admin User Story
Admin can create a category
Admin can edit a category
Admin can get all categories
Admin can delete a category
Admin can create a subject under each category
Admin can edit a subject
Admin can get all subjects
Admin can delete a subject
Admin can book a lesson for a student
Admin can get all lesson bookings
Admin can cancel a lesson booking
Admin can get all tutors
Admin can deactivate a tutor ( a deactivated tutor will not be able to login but the account exists). You can send a 403 response when a deactivated tutor tries to login
Sample response
{
“status”: 403,
“error”: “Account deactivated, permission denied”
}

Subject - English /PUT

-   \_id = '123456'
-   tutors = ['077337']

Tutor - Femi - UNREGISTERED

-   \_id = '098673'

Tutor - Yemi - REGISTERED

-   \_id = '077337'

Tutor User Story
Tutor can register
Tutor can login with email and password
Tutor can register under a subject (hint: registered tutors under a subject will be shown when a request is made to view a subject by id, use mongodb populate to show tutor details, remember there’s an array field in subject schema that stores ids of tutors)
Tutor can deregister or unregister from a subject (hint: javascript array methods e.g push, splice, indexOf e.t.c)
Tutor can accept a booking for lesson
Tutor can reject a booking for lesson
Tutor can cancel a booking for lesson
Tutor can get his / her own bookings for lessons only.
Tutor can get all categories
Tutor can get all subjects
Tutors can set their hourly rate (money) on their profile
Cumulated rating from tutor reviews should appear on their profile
Student User Story
Student can register
Student can login with email and password
Student can get all categories
Student can get all subjects
Student can view all tutors
Student can book for a lesson
Student can cancel a lesson booking
Student can get their own lesson bookings only
Student can add a review for a tutor after a lesson
Student should be able to view a tutor by id and see all subjects that the tutor registered for

MAJOR HINTS
Models:  
Student
SuperAdmin
Admin
Tutor
Category
Subject
Booking
Review

Booking is a joint table. It basically stores, id of the tutor, student, subject or subjects and calculates the amount from tutor hourly rate and the duration of the subject or subjects. Try to figure out the schema yourself
Reviews should also carry id of bookings, it will be used to validate against adding reviews for a tutor without having a session. And the id of booking in reviews should be unique
Try to understand One to many relationships of databases (MongoDB in this case but pretty much the same across all databases).
Helpful Links:

-   One to Many Relationship in MongoDB NodeJS Example
-   MongoDB Database Relationships
