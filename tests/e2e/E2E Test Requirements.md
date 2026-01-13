# Desktop

## Landing Page
- All elements visible on the landing page should animate in on load, without having to scroll down any at all
- Should contain Title (Name), Subtitle (Job Title), Comment, Vector Avatar, Contact Me button, Github and LinkedIn logos, Navbar, and Mouse Scroll Indicator

### Navbar
1. Nav links will scroll smoothly to the appropriate header when clicked
2. Nav links have smooth color wipe effect with underline bar that appears when hovered
3. Nav links animated in with slide down animation with stagger between each nav link
4. Clicking on logo should bring users to the home page / root

#### Theme Switcher
1. Switches between dark mode and light mode on the website when clicked
2. Icons switch between sun and moon when clicked
3. Wipe animation across the screen to change the colors for the new mode when clicked
4. Should read from users preference / system settings to set initial color
5. Persists theme choice. Uses `localStorage`

### Mouse Scroll Indicator
1. Animates in with slide up effect
	1. Should be last item to start and last item to finish animating
2. Mouse Scroll wheel should move downwards then disappear and loop starting back at the top
3. Animates out with fade animation once scrolled far enough down, should be much shorter than the **Scroll To Top Button**, and should disappear once the user is half way down the landing page

### Contact Me Button
1. On hover should add little left chevrons / arrow (`<<`) to the right of button text inside of the button
	1. Should shift anything else on that line *smoothly* to make room for the new arrow
2. Shows the Contact Me Modal when clicked
	1. Should animate in with an animation

#### Contact Me Modal
1. Should animate in once requested to open
2. Should close when clicking `X` in top right corner
	1. `X` should change to yellow and spin when hovered
3. Should close when clicking outside of the modal
4. Should close when pressing `Esc` on keyboard
5. Should animate out once requested to close

### Contact Me Socials
1. Should navigate to my LinkedIn and Github when icons are clicked
2. Icons should change color smoothly when hovered

## Scroll To Top Button
1. When clicked will scroll to the top of the website smoothly
2. Hidden by default until scrolled far enough down for a go to top to be worth it
3. Animates in with slide left animation and fade once scrolled far enough down in website
	1. I think this is set to 1100 px, but need to double check this
4. Animates out with slide right animation and fade once scrolled far enough back up in website
5. Should slightly increase in size when hovered

## About Me
1. Should have organic blob as background, hopefully scaling to fit all screen sizes
2. Each image should animate in with separate stagger in when scrolled past (10% of element)
3. Images should be centered in the left side
	1. Two images on top
	2. One image on bottom centered between the images on top
4. Text blob should be centered in the right side
5. S logo overlay should be behind organic blob

## Experience
1. Each card should be colored to the company's color
2. Each card should have: *Company, Position, Location, Duration, Logo, Bullet Points, Technologies*
	1. The technologies for each company should be colored to the company's color and match the company name at the top of the card
3. If a card's bullet point has a link it should be clickable and navigate to that link/website
4. Each card should animate in when scrolled past

## Skills And Technologies
1. Each item should animate in when scrolled past with it's own separate delay/stagger
2. Each item's icon should slightly enlarge, and text have the same smooth color wipe effect and underline that the nav links have when hovered
3. Each item's text should be centered to the icon
4. Each row should be centered to the page
5. Should have organic blob as background, hopefully scaling to fit all screen sizes

## SW Projects
1. Each card should be colored to the company's color
2. Each card should have: *Title, Technologies, Thumbnail, Bullet Points, View Code button*
	1. View Site button is optional and only for the projects that are currently being hosted live
	2. The technologies for each company should be the main purple color
	3. The thumbnail can be an image or a video
		1. If it's a video it should auto play
3. If a card's bullet point has a link it should be clickable and navigate to that link/website
4. Each card should animate in when scrolled past

## Art Projects
1. Each project should render in the grid
2. Each project should animate in with it's own separate stagger once scrolled past
3. Each project should slightly enlarge when hovered
4. When clicking on a project is should open in a 'full screen' image modal/viewer
	1.  Should animate in clicked
	2. Should close when clicking `X` in top right corner
		1. `X` should change to yellow and spin when hovered
	3. Should close when clicking outside of the modal/in the background
	4. Should close when pressing `Esc` on keyboard
	5. Should animate out once requested to close

## Footer
1. Should render multi purple color wave blobs at the bottom

# Mobile/Tablet
## General Layout
1. Layout should reflow so that it becomes a single column layout

## Landing Page
### Navbar
1. Navbar should transform into a hamburger menu (3 horizontal lines) in the top right corner
2. When clicking the hamburger menu/3 horizontal lines, it should animate in drawer with a slide animation from the right side
	1. The hamburger button/3 horizontal lines should morph into an `X` 
3. Each nav link should then animate in with a slide animation from the right side, with each having it's own separate stagger with the top one being first and each one below is a bit after each
4. When clicking the `X` or tapping one of the nav links the `X` should morph back into the 3 horizontal lines
5. Clicking on a navlink should animate the navlink out out with the slide animation to the right side, then close the hamburger menu/drawer and then smoothly scrolling to the section that was tapped
6. The theme switcher should continue to work like usual (switching themes/colors with a color wipe animation)

### Profile Pic
1. Profile pic should be the center/main focus/element in the mobile/tablet layout

### Layout Order
1. Navbar
2. Landing Page Text (Name, Title, Description)
3. Contact Me Bar (Contact Me button, social logos (github and linkedin logos with links))

### Mouse Scroll Indicator
1. Should not appear ever because mobile devices it's natural to scroll down

## Scroll To Top Button
1. Should not appear ever because mobile devices have native way to scroll to the top (tap the top status bar)

## About Me
1. Similar to the General Layout, everything should be in one column now.
### Layout Order
1. About Me Images
2. About Me section title
3. About Me description
## Experience
1. Should be almost the same as the desktop version as this section was already in a 1 column layout

## Skills And Technologies
1. Should also be mostly the same, already scales with the width of the screen

## SW Projects
1. Overall layout should mostly be the same besides the cards themselves
### Card Layout
1. Should make everything 1 column wide, with new order of everything on top of each other and new order defined here
	1. Project Title
	2. Technology Bar on it's own line
	3. Thumbnail takes up most of the width
	4. Description/bullet points
	5. Button Bar (Visit Site/View Code Buttons)
2. Thumbnail videos should still autoplay
3. Thumbnail videos should be able to be paused by tapping on them
4. Special handling for the built in browser inside Instagram (built in safari)
	1. Video's were autoplaying and using the native mobile video player, taking users into the video player, instead of just playing as little thumbnails on the website
	2. Setting them to not autoplay was also making them not play at all
	3. Instead make them not autoplay and display a play button on them to start playing the video
	4. Once the play button is clicked, start the video, and make the play button disappear slowly
	5. If the user clicks/taps the video again it should pause the video and show the play button again

## Art Projects
1. Should use a carousel showing a single image instead of the grid
2. Tapping on the photos should do nothing, unlike in the desktop version where clicking on one of the photos brings it into the 'fullscreen viewer'
3. Users should be able to tap next & previous arrow
4. Below the carousel should show dots denoting the number of photos in the carousel and the current index/number photo you are viewing in the carousel