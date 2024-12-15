# 📚 **Quiz Application**

Welcome to the **Quiz Application**! This project is a dynamic and engaging platform that allows users to participate in a quiz, track their progress, and view results with detailed feedback.  

## 🚀 **Features**

- **Dynamic Question Loading**: Fetch questions from a backend server for real-time quiz updates.  
- **Interactive UI**: User-friendly design with progress indicators and animations.  
- **Answer Validation**: Automatic result computation with correct and incorrect answers highlighted.  
- **Result Dashboard**: Displays score, correct answers, and incorrect answers in an appealing format.  
- **Retry Quiz**: Users can restart the quiz and try again.  
- **IP Tracking**: Captures user IP for identification or analytics purposes.  

---

## 🛠️ **Technologies Used**

- **Frontend**: React.js  
- **Styling**: CSS  
- **Backend**: Node.js/Express.js (Example API endpoints assumed)  
- **Database**: MongoDB or any other data storage for quiz questions and answers  
- **External APIs**:  
  - [ipify](https://www.ipify.org/) for fetching user IP address  

---

## 🔗 **API Endpoints Used**

- **POST API**: Store the user answers.
  ```
  https://quiz-backend-78kd.onrender.com/api/quiz/answer
  ```
- **GET API**: Fetch the stored answers.
  ```
  https://quiz-backend-78kd.onrender.com/api/quiz/
  ```
- **GET API**: Retrieve the quiz questions.
  ```
  https://quiz-backend-78kd.onrender.com/api/quiz/questions
  ```

---

## ⚙️ **Installation and Setup**

Follow these steps to set up the project locally:  

### Prerequisites  
- Node.js and npm installed on your machine.  
- A running backend server that provides quiz questions (Example endpoint: `http://localhost:5000/api/quiz/questions`).  

### Steps  
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/hariharan138/Quiz-app.git
   cd quiz-app
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Run the Application**  
   ```bash
   npm start
   ```

4. **Access the Application**  
   Open your browser and navigate to `http://localhost:3000`.

---

## 📋 **Folder Structure**

```plaintext
quiz-app/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable React components        
│   ├── Quiz.css        # CSS files
│   ├── Quiz.jsx        # Core Quiz component
│   ├── index.js       # Entry point
├── README.md          # Documentation file
├── package.json       # Project dependencies and scripts
```

---

## 🎮 **How to Use**

1. Launch the application and click the **Start** button to begin the quiz.  
2. Answer each question by selecting one of the given options.  
3. Click **Next** to proceed to the next question.  
4. After completing the quiz, view your **score** and detailed result.  
5. Restart the quiz anytime by clicking **Start Again**.  

---

## 🌟 **Project Highlights**

- **Real-Time Feedback**: See a detailed breakdown of your performance after the quiz.  
- **Easy Customization**: Modify questions, styles, or backend logic effortlessly.  
- **Attractive UI**: Responsive design with engaging animations.  

---

## 🛣️ **Contributing**

Contributions are welcome! If you'd like to enhance the quiz, follow these steps:  

1. Fork the repository.  
2. Create a new branch for your feature:  
   ```bash
   git checkout -b feature-name
   ```  
3. Commit your changes:  
   ```bash
   git commit -m "Add new feature"  
   ```  
4. Push to the branch:  
   ```bash
   git push origin feature-name
   ```  
5. Open a Pull Request.  

---

## 📢 **Contact**

If you have any questions or feedback, feel free to reach out!  
- **Email**: hariharan98704@gmail.com  
- **GitHub**: https://github.com/hariharan138/  
- **Portfolio**: https://hariharan13.vercel.app/  
---


