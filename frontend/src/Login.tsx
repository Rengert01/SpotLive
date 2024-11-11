// // This file is used to create the login page which is displayed first. 
// // The file contains a input field for the username and password. And a button to log in.
// // The user credentials should be checked, if they are correct the user moves to the App page, 
// // otherwise an error message is displayed and the user has to try again.

// // The content of the page is shown centered in the middle of the screen. The username, password and login button are placed under each other.

// export default function Login() {
//     return (
//         <div className="flex items-center justify-center h-screen">
//             <div className="w-96">
//                 <input type="text" placeholder="Username" className="w-full p-2 mb-2 border border-gray-300 rounded" />
//                 <input type="password" placeholder="Password" className="w-full p-2 mb-2 border border-gray-300 rounded" />
//                 <button className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
//             </div>
//         </div>
//     );
// }