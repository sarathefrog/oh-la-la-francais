const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs').promises;
const path = require('path');

class GoogleCalendarService {
    constructor() {
        this.oauth2Client = null;
        this.calendar = null;
        this.credentials = null;
        this.tokenPath = path.join(__dirname, '..', 'google-token.json');
        this.credentialsPath = path.join(__dirname, '..', 'google-credentials.json');
    }

    async initialize() {
        try {
            // Use Google Calendar appointment scheduling link instead of OAuth2
            this.appointmentScheduleUrl = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NtoUdys7OfznfPZvLtIq68BWM3_CZ3Vk8ZKSo8iEsuxtEasuumNXB3s9LEcdt37oAl5R1i-bA';
            
            console.log('✅ Google Calendar appointment scheduling service initialized');
            console.log('🔗 Appointment booking link:', this.appointmentScheduleUrl);
            return true;
        } catch (error) {
            console.error('❌ Error initializing Google Calendar service:', error);
            return false;
        }
    }

    async loadCredentials() {
        try {
            const credentials = await fs.readFile(this.credentialsPath, 'utf8');
            return JSON.parse(credentials);
        } catch (error) {
            return null;
        }
    }

    async loadToken() {
        try {
            const token = await fs.readFile(this.tokenPath, 'utf8');
            return JSON.parse(token);
        } catch (error) {
            return null;
        }
    }

    async saveToken(token) {
        try {
            await fs.writeFile(this.tokenPath, JSON.stringify(token));
            console.log('✅ Google Calendar token saved');
        } catch (error) {
            console.error('❌ Error saving token:', error);
        }
    }

    getAuthUrl() {
        if (!this.oauth2Client) {
            throw new Error('OAuth2 client not initialized');
        }

        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
            prompt: 'consent'
        });

        return authUrl;
    }

    async authenticate(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            await this.saveToken(tokens);
            
            this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
            console.log('✅ Google Calendar authenticated successfully');
            return true;
        } catch (error) {
            console.error('❌ Error authenticating with Google Calendar:', error);
            return false;
        }
    }

    async createEvent(eventDetails) {
        try {
            if (!this.calendar) {
                throw new Error('Calendar not initialized');
            }

            const event = {
                summary: eventDetails.title,
                description: eventDetails.description || '',
                start: {
                    dateTime: eventDetails.startTime,
                    timeZone: 'Asia/Tehran',
                },
                end: {
                    dateTime: eventDetails.endTime,
                    timeZone: 'Asia/Tehran',
                },
                attendees: eventDetails.attendees || [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 },
                    ],
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            console.log('✅ Event created:', response.data.htmlLink);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating event:', error);
            throw error;
        }
    }

    async createTestClassEvent(studentName, studentPhone, studentEmail, scheduledTime) {
        const startTime = new Date(scheduledTime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        const eventDetails = {
            title: `🆓 کلاس آزمایشی - ${studentName}`,
            description: `کلاس آزمایشی رایگان برای ${studentName}\nتلفن: ${studentPhone}\nایمیل: ${studentEmail}\n\nاین کلاس از طریق ربات کلاس فرانسه زهرا رزرو شده است.`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            attendees: [
                { email: studentEmail, displayName: studentName }
            ]
        };

        return await this.createEvent(eventDetails);
    }

    async getAvailableTimeSlots() {
        try {
            // Return appointment scheduling link instead of generating slots
            return {
                appointmentUrl: this.appointmentScheduleUrl,
                message: 'Use the appointment scheduling link to book test classes',
                slots: [] // No specific slots - user books through Google Calendar
            };
        } catch (error) {
            console.error('Error getting available time slots:', error);
            throw error;
        }
    }

    async bookTestClassSlot(studentName, studentPhone, studentEmail, selectedSlot) {
        try {
            // Return appointment scheduling link for booking
            return {
                success: true,
                appointmentUrl: this.appointmentScheduleUrl,
                confirmation: {
                    studentName,
                    phone: studentPhone,
                    email: studentEmail,
                    message: 'لطفاً از لینک زیر برای رزرو کلاس آزمایشی استفاده کنید',
                    bookingLink: this.appointmentScheduleUrl
                }
            };
        } catch (error) {
            console.error('Error booking test class slot:', error);
            throw error;
        }
    }

    async createRegularClassEvent(studentName, classDetails, scheduledTime) {
        const startTime = new Date(scheduledTime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        const eventDetails = {
            title: `📚 کلاس فرانسه - ${studentName}`,
            description: `کلاس ${classDetails.level || 'فرانسه'} - ${classDetails.type || 'خصوصی'}\nسطح: ${classDetails.level || 'نامشخص'}`,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            attendees: [
                { email: classDetails.email || '', displayName: studentName }
            ]
        };

        return await this.createEvent(eventDetails);
    }

    async getEvents(timeMin, timeMax) {
        try {
            if (!this.calendar) {
                throw new Error('Calendar not initialized');
            }

            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin: timeMin,
                timeMax: timeMax,
                maxResults: 100,
                singleEvents: true,
                orderBy: 'startTime',
            });

            return response.data.items || [];
        } catch (error) {
            console.error('❌ Error fetching events:', error);
            throw error;
        }
    }

    async getUpcomingEvents(days = 7) {
        const now = new Date();
        const timeMax = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return await this.getEvents(now.toISOString(), timeMax.toISOString());
    }

    async deleteEvent(eventId) {
        try {
            if (!this.calendar) {
                throw new Error('Calendar not initialized');
            }

            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId,
            });

            console.log('✅ Event deleted:', eventId);
            return true;
        } catch (error) {
            console.error('❌ Error deleting event:', error);
            throw error;
        }
    }

    async updateEvent(eventId, eventDetails) {
        try {
            if (!this.calendar) {
                throw new Error('Calendar not initialized');
            }

            const event = {
                summary: eventDetails.title,
                description: eventDetails.description || '',
                start: {
                    dateTime: eventDetails.startTime,
                    timeZone: 'Asia/Tehran',
                },
                end: {
                    dateTime: eventDetails.endTime,
                    timeZone: 'Asia/Tehran',
                },
            };

            const response = await this.calendar.events.update({
                calendarId: 'primary',
                eventId: eventId,
                resource: event,
            });

            console.log('✅ Event updated:', response.data.htmlLink);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating event:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return true; // Always authenticated with appointment scheduling
    }
    
    isInitialized() {
        return this.appointmentScheduleUrl !== null;
    }

    async getAuthStatus() {
        return { 
            authenticated: true, 
            message: 'Appointment scheduling service ready',
            appointmentUrl: this.appointmentScheduleUrl
        };
    }
}

module.exports = GoogleCalendarService;
