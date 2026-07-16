# booking.md

# Booking Hotels – AI Website Build Instructions

## Project Overview

Build a **full-stack modern resort and hotel booking web application** named **Booking Hotels**.

The website allows customers to search, view, and book rooms, suites, meeting halls, party halls, and resort facilities online.

The application should have a premium, luxury-resort appearance with smooth animations, responsive layouts, professional UI/UX, secure backend architecture, and scalable middleware.

The project should be production-ready.

---

# Primary Goal

Create a complete hotel and resort booking platform similar to premium booking websites while keeping the UI modern, elegant, and easy to use.

The application must include:

- Frontend
- Backend
- Database
- Authentication
- Admin Dashboard
- Customer Dashboard
- Booking System
- Payment-ready architecture
- Responsive Design
- Dark & Light Theme
- Maps Integration
- Image Gallery
- Reviews & Ratings
- Availability Management

---

# Design Style

Use a luxury resort inspired design.

Theme:

- Modern
- Minimal
- Premium
- Elegant
- Soft Shadows
- Rounded Cards
- Glassmorphism where appropriate
- Smooth animations
- Large hero sections
- High quality imagery
- Beautiful typography

Support:

- Light Theme
- Dark Theme
- Auto Theme (System Preference)

Theme switching should happen instantly without page reload.

---

# Color Palette

Primary
- #2563EB

Secondary
- #0F172A

Accent
- #14B8A6

Success
- #22C55E

Warning
- #F59E0B

Danger
- #EF4444

Background (Light)
- #FFFFFF

Background (Dark)
- #0B1120

---

# Fonts

Headings

- Poppins

Body

- Inter

---

# Landing Page

Create an attractive landing page including:

## Hero Section

Large background image

Search card

Booking form

Fields

- Check In
- Check Out
- Adults
- Children
- Rooms
- Search Button

Animated statistics

Example

- 500+ Rooms
- 12000 Happy Guests
- 5 Star Service
- 24/7 Reception

---

## Featured Rooms

Display room cards.

Each card contains

- Image
- Room Name
- Price
- Capacity
- Amenities
- Rating
- Book Now Button

---

## Amenities Section

Display icons and descriptions.

Include

- Free WiFi
- Swimming Pool
- Spa
- Gym
- Reception
- Restaurant
- Children's Play Area
- Garden
- Party Hall
- Meeting Hall
- Conference Hall
- Room Service
- Laundry
- Housekeeping
- Air Conditioning
- Television
- Mini Bar
- Car Parking
- Security
- CCTV
- Elevator
- Power Backup
- EV Charging Station

---

## Dining

Display

- Restaurant Images
- Food Categories
- Menu
- Today's Specials
- Dining Timings

---

## Food Menu

Include

Breakfast

Lunch

Dinner

Desserts

Drinks

Veg

Non-Veg

Special Offers

Each menu item should have

- Image
- Price
- Description

---

## Children's Play Area

Display

- Images
- Safety Features
- Indoor Games
- Outdoor Games

---

## Garden

Display

- Gallery
- Seating Areas
- Night Lighting
- Walking Track

---

## Party Hall

Display

- Capacity
- Images
- Decorations
- Event Types
- Pricing

Supported Events

- Birthday
- Wedding
- Reception
- Anniversary
- Corporate Events

---

## Meeting Hall

Display

- Seating Capacity
- Audio System
- Projector
- Whiteboard
- Conference Setup

---

## Reception

Include

- 24x7 Reception
- Concierge
- Guest Assistance
- Check-In
- Check-Out

---

## Service Center

Provide services

- Laundry
- Taxi Booking
- Room Cleaning
- Medical Assistance
- Wake-up Calls
- Airport Pickup

---

## Parking Availability

Display live parking availability.

Example

Total Parking

Available

Occupied

VIP Parking

EV Parking

Show availability using colored indicators.

Green

Available

Yellow

Limited

Red

Full

---

# Room Types

Create separate pages.

Standard Room

Deluxe Room

Executive Room

Family Room

Luxury Suite

Presidential Suite

Villa

Cottage

Each room page includes

- Large Gallery
- Description
- Amenities
- Occupancy
- Pricing
- Availability Calendar
- Reviews
- Ratings
- Book Button

---

# Booking Flow

Customer selects

Room

↓

Dates

↓

Guests

↓

Extra Services

↓

Payment

↓

Booking Confirmation

↓

Email Confirmation

↓

Booking Dashboard

---

# Booking Form

Collect

First Name

Last Name

Phone

Email

Address

Country

Check-In

Check-Out

Adults

Children

Room Type

Special Requests

Coupon Code

---

# Booking Confirmation

Display

Booking ID

QR Code

Payment Status

Booking Details

Download Invoice

Print Receipt

---

# Authentication

Customer

- Login
- Register
- Forgot Password
- OTP Verification
- Email Verification

Admin

Secure Login

Role Based Authentication

---

# Customer Dashboard

Show

Upcoming Bookings

Booking History

Invoices

Saved Rooms

Favorite Rooms

Notifications

Messages

Profile

Settings

Theme Preference

---

# Admin Dashboard

Dashboard Analytics

Revenue

Bookings

Occupancy

Today's Check-Ins

Today's Check-Outs

Parking Usage

Restaurant Orders

Customer Reviews

Charts

Recent Activity

---

# Admin Features

Manage

Rooms

Amenities

Bookings

Customers

Parking

Party Halls

Meeting Halls

Food Menu

Reviews

Comments

Ratings

Offers

Coupons

Gallery

Events

Reception Staff

Service Center

Website Content

Notifications

Users

Roles

Permissions

Settings

---

# Room Availability

Display

Available

Booked

Reserved

Maintenance

Calendar View

Monthly View

Daily View

---

# Parking Availability

Manage

Total Slots

Occupied

Reserved

VIP

Visitor Parking

Electric Vehicle Parking

---

# Maps

Integrate Google Maps.

Display

Resort Location

Directions

Nearby Attractions

Nearby Airport

Nearby Railway Station

Nearby Bus Station

Navigation Button

---

# Reviews

Guests can

Write Reviews

Upload Images

Give Ratings

Edit Reviews

Delete Reviews

Helpful Votes

---

# Rating System

5 Star Rating

Average Rating

Recent Reviews

Popular Reviews

Verified Guest Reviews

---

# Comments

Nested Comments

Replies

Like

Report Abuse

Admin Moderation

---

# Image Gallery

Categories

Rooms

Dining

Garden

Swimming Pool

Party Hall

Meeting Hall

Reception

Parking

Events

Restaurant

Children's Area

Luxury Suites

Support

Grid

Carousel

Fullscreen Viewer

Zoom

Lazy Loading

---

# Search

Global Search

Search by

Room Type

Price

Amenities

Capacity

Availability

Location

Rating

---

# Filters

Price

Rating

Room Type

Beds

Parking

Food Included

Pool

Garden

Children Friendly

---

# Wishlist

Users can

Save Rooms

Compare Rooms

Book Later

---

# Notifications

Email

SMS Ready

Push Notifications Ready

Booking Alerts

Payment Alerts

Offer Alerts

---

# Payment Architecture

Create payment-ready architecture.

Support

Stripe

PayPal

Razorpay

UPI

Credit Card

Debit Card

Cash Payment

The architecture should allow enabling or disabling payment gateways without major code changes.

---

# Backend

Use a clean architecture.

Suggested Stack

Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

Backend

- Node.js
- Express.js

Database

- PostgreSQL (preferred)
  or
- MySQL

ORM

- Prisma

Authentication

- JWT
- Refresh Tokens

File Storage

- Cloudinary or AWS S3

Caching

- Redis

Email

- Nodemailer

Validation

- Zod

API

RESTful APIs

Well documented

---

# Middleware

Implement middleware for

Authentication

Authorization

Logging

Validation

Rate Limiting

Security Headers

Error Handling

Request Monitoring

Performance Monitoring

Audit Logs

---

# Security

Use

HTTPS Ready

JWT Authentication

Password Hashing

Helmet

CORS

Rate Limiting

SQL Injection Protection

XSS Protection

CSRF Protection

Secure Cookies

Environment Variables

Role Based Access

---

# Performance

Lazy Loading

Image Optimization

Caching

Pagination

Infinite Scroll

Server-side Rendering where appropriate

Code Splitting

Compression

SEO Optimization

---

# Accessibility

Follow WCAG guidelines.

Include

Keyboard Navigation

ARIA Labels

High Contrast

Screen Reader Support

Accessible Forms

---

# SEO

Generate

Meta Tags

Structured Data

Open Graph

Twitter Cards

Canonical URLs

XML Sitemap

Robots.txt

Friendly URLs

---

# Contact Page

Include

Contact Form

Phone

Email

Address

Working Hours

Google Map

Social Links

---

# About Page

Include

Company Story

Mission

Vision

Values

Awards

Gallery

---

# FAQ

Booking Questions

Cancellation

Refund

Payments

Parking

Children

Pets

Dining

Rooms

---

# Footer

Include

Quick Links

Services

Support

Privacy Policy

Terms & Conditions

Cancellation Policy

Refund Policy

Cookies Policy

Newsletter

Social Media

Copyright

---

# Responsive Design

Fully responsive.

Optimize for

Desktop

Laptop

Tablet

Mobile

Large Screens

---

# Animations

Smooth page transitions

Fade animations

Card hover effects

Parallax sections

Loading skeletons

Micro interactions

---

# Database Tables

Include at minimum

Users

Roles

Permissions

Rooms

Room Types

Amenities

Bookings

Payments

Invoices

Parking

Parking Slots

Reviews

Ratings

Comments

Images

Gallery

Food Menu

Orders

Events

Party Halls

Meeting Halls

Reception

Service Center

Notifications

Coupons

Offers

Settings

Audit Logs

---

# API Modules

Authentication

Users

Rooms

Availability

Bookings

Payments

Reviews

Comments

Ratings

Gallery

Parking

Restaurant

Food Menu

Maps

Notifications

Admin

Dashboard

Reports

Analytics

---

# Final Requirement

The generated application should look like a premium international resort booking platform with a highly polished UI/UX, modern architecture, responsive design, scalable backend, secure middleware, and clean production-ready code.

The website should be visually impressive, fast, accessible, secure, and easy to extend with future features such as loyalty programs, AI recommendations, online chat support, and mobile applications.
