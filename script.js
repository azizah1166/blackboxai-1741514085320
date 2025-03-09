// Global Variables
let attendancePoints = 0;
let achievementPoints = 0;
let offensePoints = 0;

// Clock functionality
function updateClock() {
    const now = new Date();
    const timeDisplay = document.getElementById('clock');
    if (timeDisplay) {
        timeDisplay.textContent = now.toLocaleTimeString();
    }
}

// Initialize clock
function initClock() {
    // Create clock element if it doesn't exist
    if (!document.getElementById('clock')) {
        const clockSection = document.getElementById('attendance');
        const clockDiv = document.createElement('div');
        clockDiv.id = 'clock';
        clockDiv.className = 'digital-clock';
        clockSection.appendChild(clockDiv);
    }
    // Update clock every second
    setInterval(updateClock, 1000);
}

// Attendance tracking
function recordAttendance(status) {
    const timestamp = new Date();
    const attendanceLog = {
        status: status,
        timestamp: timestamp,
    };
    
    // Store attendance in localStorage
    let attendanceHistory = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    attendanceHistory.push(attendanceLog);
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
    
    // Update attendance points
    if (status === 'present') {
        attendancePoints += 10;
        updateScores();
    }
    
    // Update timesheet display
    updateTimesheet();
}

// Achievement tracking
function addAchievement(title, points) {
    const achievement = {
        title: title,
        points: points,
        timestamp: new Date()
    };
    
    // Store achievement in localStorage
    let achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    achievements.push(achievement);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    achievementPoints += points;
    updateScores();
    updateGraphs();
    updateAchievementsList();
}

// Offense tracking
function recordOffense(description, points) {
    const offense = {
        description: description,
        points: points,
        timestamp: new Date()
    };
    
    // Store offense in localStorage
    let offenses = JSON.parse(localStorage.getItem('offenses') || '[]');
    offenses.push(offense);
    localStorage.setItem('offenses', JSON.stringify(offenses));
    
    offensePoints += points;
    updateScores();
    updateGraphs();
    updateOffensesList();
}

// Update scores display
function updateScores() {
    // Update attendance score
    const attendanceScore = document.getElementById('attendance-score');
    if (attendanceScore) {
        attendanceScore.textContent = attendancePoints;
    }
    
    // Update achievement score
    const achievementScore = document.getElementById('achievement-score');
    if (achievementScore) {
        achievementScore.textContent = achievementPoints;
    }
    
    // Update offense score
    const offenseScore = document.getElementById('offense-score');
    if (offenseScore) {
        offenseScore.textContent = offensePoints;
    }
    
    // Calculate and update reward points
    const rewardPoints = Math.max(0, attendancePoints + achievementPoints - offensePoints);
    const rewardScore = document.getElementById('reward-score');
    if (rewardScore) {
        rewardScore.textContent = rewardPoints;
    }
}

// Graph functionality
function updateGraphs() {
    const ctx = document.getElementById('performance-graph');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }

    // Create new chart
    window.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Attendance', 'Achievements', 'Offenses'],
            datasets: [{
                label: 'Points',
                data: [attendancePoints, achievementPoints, offensePoints],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// QRIS functionality
function generateQRCode(amount) {
    const qrisContainer = document.getElementById('qris-code');
    if (!qrisContainer) return;

    // In a real implementation, this would connect to a QRIS service
    // For demo purposes, we'll just show a placeholder
    qrisContainer.innerHTML = `
        <div class="qris-placeholder">
            <i class="fas fa-qrcode fa-5x"></i>
            <p>QRIS Code for Rp${amount.toLocaleString()}</p>
        </div>
    `;
}

// Function to update achievements list
function updateAchievementsList() {
    const achievementList = document.querySelector('.achievement-list');
    if (!achievementList) return;

    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    achievementList.innerHTML = achievements
        .map(achievement => `
            <div class="achievement-item">
                <i class="fas fa-star"></i>
                <span>${achievement.title} (+${achievement.points} points)</span>
                <small>${formatDate(achievement.timestamp)}</small>
            </div>
        `)
        .join('');
}

// Function to update offenses list
function updateOffensesList() {
    const offenseList = document.querySelector('.offense-list');
    if (!offenseList) return;

    const offenses = JSON.parse(localStorage.getItem('offenses') || '[]');
    offenseList.innerHTML = offenses
        .map(offense => `
            <div class="offense-item">
                <i class="fas fa-exclamation-circle"></i>
                <span>${offense.description} (-${offense.points} points)</span>
                <small>${formatDate(offense.timestamp)}</small>
            </div>
        `)
        .join('');
}

// Function to format dates
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to update the timesheet display
function updateTimesheet() {
    const timesheetContainer = document.getElementById('timesheet-entries');
    if (!timesheetContainer) return;

    const attendanceHistory = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    
    timesheetContainer.innerHTML = attendanceHistory
        .map(entry => `
            <div class="timesheet-entry">
                <span class="date">${formatDate(entry.timestamp)}</span>
                <span class="status status-${entry.status}">${entry.status}</span>
            </div>
        `)
        .join('');
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    updateScores();
    updateGraphs();
    updateTimesheet();
    updateAchievementsList();
    updateOffensesList();
    
    // Add event listeners for demo functionality
    const demoButtons = document.querySelectorAll('[data-demo]');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.demo;
            switch(action) {
                case 'attendance':
                    recordAttendance('present');
                    break;
                case 'achievement':
                    addAchievement('Demo Achievement', 5);
                    break;
                case 'offense':
                    recordOffense('Demo Offense', 3);
                    break;
            }
        });
    });
});
