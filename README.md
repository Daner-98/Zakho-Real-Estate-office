# CEO Real Estate Website

A modern, responsive real estate website designed specifically for CEOs to showcase properties and manage their real estate business.

## Features

### Public Website
- Responsive design that works on all devices
- Professional homepage with hero section
- Property listings with photos and details
- Advanced search functionality by property name or location
- Detailed property view with photos and videos
- Clean, professional design that reflects CEO branding

### CEO Dashboard
- Secure login system (username: ceo, password: password123)
- Property management (add, edit, delete)
- Transaction tracking with buyer/seller information
- Client contact management with banking details
- Financial records for deposits and withdrawals
- Search functionality across all data tables

## How to Use

### Viewing the Website
1. Simply open `index.html` in a web browser
2. Browse properties on the homepage
3. Use the search bar to find specific properties by name or location
4. Click "View Details" to see more information about a property, including photos and videos

### CEO Access
1. Click "CEO Login" in the top navigation
2. Enter credentials:
   - Username: `ceo`
   - Password: `password123`
3. Navigate between dashboard sections using the tabs:
   - Properties: Manage real estate listings
   - Transactions: Track property sales with buyer/seller information
   - Contacts: Manage client information with banking details
   - Finances: Track deposits and withdrawals related to properties

### Managing Properties
1. In the CEO dashboard, go to the "Properties" tab
2. Click "Add New Property" to create a listing
3. Fill in all required information:
   - Property name, phone number, location, price
   - Property type (house, land, or apartment)
   - For houses and apartments: bedrooms, bathrooms, floor
   - Description
   - Photo and video URLs (comma-separated)
4. Click "Add Property" to save

### Managing Other Data
- Transactions: Track property sales with complete buyer/seller information
- Contacts: Store client information with banking details
- Finances: Record deposits and withdrawals related to properties

## Technical Details

This website is built with:
- HTML5 for structure
- CSS3 for styling (with responsive design)
- Vanilla JavaScript for functionality
- No external dependencies - works completely offline

All data is stored in JavaScript arrays in the `script.js` file, making it easy to run without a backend server.

## Customization

To add your own property data:
1. Open the CEO dashboard and add properties through the "Add New Property" form
2. For best results, use direct image and video URLs
3. All property information is stored locally in your browser

To change the login credentials:
1. Modify the validation logic in the login form submit handler in `script.js`
2. Change the username and password values

## Data Structure

Properties require the following fields:
- Name
- Phone number
- Location
- Price
- Type (house, land, or apartment)
- Bedrooms (for houses/apartments only)
- Bathrooms (for houses/apartments only)
- Floor (for houses/apartments only)
- Description
- Photos (URLs, comma-separated)
- Videos (URLs, comma-separated)

## Support

For any issues or questions, please contact the website administrator.