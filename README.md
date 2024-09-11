# InstaGrab

**InstaGrab** is a Puppeteer-based Instagram scraper designed to extract user profile information, including username, profile picture, followers count, and post engagement metrics (likes and comments).

## Features

- **Login to Instagram**: Automate login using provided credentials.
- **Profile Extraction**: Fetch username, profile picture, and follower count.
- **Post Engagement**: Extract likes and comments from posts by scrolling and hovering.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/instasleuth.git
   ```

2. Navigate to the project directory:

   ```bash
   cd instasleuth
   ```

3. Install the required packages:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory of the project and add your Instagram credentials and page URL:

   ```dotenv
   IG_USERNAME=your_instagram_username
   IG_PASSWORD=your_instagram_password
   IG_PAGE=target_instagram_page
   DEBUG_MODE=false
   ```

## Usage

1. **Set Up Environment Variables**: Create a `.env` file in the project root and add your Instagram credentials.

   ```env
   IG_USERNAME=your_username
   IG_PASSWORD=your_password
   IG_PAGE=instagram_page_to_scrape
   DEBUG_MODE=true
   ```

2. **Run the Script**: Execute the following command to start scraping.

   ```bash
   npm run dev
   ```
