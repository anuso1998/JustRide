# 🚗 JustRide

JustRide is a comprehensive web-based platform designed to streamline Non-Emergency Medical Transportation (NEMT) operations.
It enables transportation providers to efficiently schedule, assign, and track medical trips while maintaining service quality and compliance. 
The system supports dispatchers and fleet managers with accurate trip grouping, driver coordination, and real-time updates. 
By improving operational efficiency and client reliability, JustRide ensures communities have safe, timely access to essential healthcare services.

---

## ✨ Features

✅ **Automatic Theme Switching**  
- Detects the user’s system preference (dark or light mode).  
- Logo automatically swaps based on the theme.

✅ **Clickable Logo Navigation**  
- Click the JustRide logo to go back to the Home page at any time.

✅ **Admin Dashboard**  
- Upload `.xlsx` or `.csv` files for trip data.
- Sort trips by Pickup City or Trip Number.
- Expand trip details, select/unselect trips.
- Assign trips to drivers.
- View and manage all assigned trips.
- Clear all assignments if needed.

✅ **Drivers View**  
- See all drivers in a clean button layout.
- Click any driver to view their assigned trips for a selected date.
- Unassign trips for a driver easily.

✅ **Fully Responsive & Theme-aware UI**  
- Clean design using Tailwind CSS.
- Works on both light and dark mode with no functionality loss.

---

## ⚙️ Tech Stack

- **React**
- **Firebase Firestore**
- **Tailwind CSS** with `dark` mode support
- **XLSX.js** for file parsing
- **React Router**

---

## 🚀 Getting Started

### 1️⃣ Clone this repo:
```bash
git clone https://github.com/anuso1998/justRide.git
cd justride
2️⃣ Install dependencies:
npm install
3️⃣ Configure Firebase:
Add your Firebase config in /src/firebase.js.
4️⃣ Run locally:
npm run dev
# or
npm start
5️⃣ Build for production:
npm run build
📝 Project Structure
/src
 ├── components/
 │   ├── Navbar.jsx
 │   └── ...
 ├── pages/
 │   ├── Home.jsx
 │   ├── AdminDashboard.jsx
 │   └── ...
 ├── assets/
 │   ├── JUSTRIDE-01.png  // dark mode logo
 │   ├── logo-light.png   // light mode logo
 ├── App.js
 ├── index.css
 ├── firebase.js
 └── ...

⚡ Notes
✅ Theme switching is handled with prefers-color-scheme and Tailwind’s dark: classes.
✅ Logo dynamically updates when system theme changes.
✅ All dashboard functionality remains intact with theme switching.
✅ Make sure postcss.config.js and tailwind.config.js are properly set up for Tailwind CSS.
✅ Use the Tailwind CSS IntelliSense VS Code extension for better development experience.
📌 License
This project is for demonstration purposes — feel free to customize, extend, or adapt for your business needs!
📫 Contact
For any questions or contributions, open an issue or reach out at anuso1998@@gmail.com.
