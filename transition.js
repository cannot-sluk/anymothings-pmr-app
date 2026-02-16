// Transition planner functionality
let selectedCatForTransition = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCatsForTransition();
});

function loadCatsForTransition() {
    const stored = localStorage.getItem('rawCatDietCats');
    const cats = stored ? JSON.parse(stored) : [];
    
    const container = document.getElementById('catSelector');
    
    if (cats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>😺 還沒有儲存的貓咪資料</p>
                <p>No saved cats yet</p>
                <a href="calculator.html" class="btn">前往新增貓咪 Add a Cat</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="cat-selection-grid">
            ${cats.map(cat => `
                <div class="cat-select-card" onclick="selectCatForTransition('${cat.id}')">
                    <h4>🐱 ${cat.name}</h4>
                    <p>${cat.weight} kg</p>
                    ${cat.transitionPlan ? '<span class="has-plan-badge">✓ 已有計劃</span>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function selectCatForTransition(catId) {
    const stored = localStorage.getItem('rawCatDietCats');
    const cats = stored ? JSON.parse(stored) : [];
    const cat = cats.find(c => c.id === catId);
    
    if (!cat) return;
    
    selectedCatForTransition = cat;
    document.getElementById('selectedCatName').textContent = cat.name;
    document.getElementById('transitionPlanSection').style.display = 'block';
    
    // Load existing plan if available
    if (cat.transitionPlan) {
        document.getElementById('currentDiet').value = cat.transitionPlan.currentDiet;
        document.getElementById('transitionSpeed').value = cat.transitionPlan.speed;
    }
    
    document.getElementById('transitionPlanSection').scrollIntoView({ behavior: 'smooth' });
}

function generateTransitionPlan() {
    if (!selectedCatForTransition) return;
    
    const currentDiet = document.getElementById('currentDiet').value;
    const speed = parseInt(document.getElementById('transitionSpeed').value);
    
    const plan = createTransitionSchedule(currentDiet, speed);
    
    // Save plan to cat profile
    const stored = localStorage.getItem('rawCatDietCats');
    const cats = stored ? JSON.parse(stored) : [];
    const catIndex = cats.findIndex(c => c.id === selectedCatForTransition.id);
    
    if (catIndex !== -1) {
        cats[catIndex].transitionPlan = {
            currentDiet,
            speed,
            schedule: plan,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('rawCatDietCats', JSON.stringify(cats));
    }
    
    displayTransitionPlan(plan, currentDiet, speed);
}

function createTransitionSchedule(currentDiet, days) {
    const schedule = [];
    const phases = days === 7 ? 3 : days === 14 ? 4 : 6;
    const daysPerPhase = Math.floor(days / phases);
    
    let currentDay = 1;
    
    for (let phase = 1; phase <= phases; phase++) {
        const rawPercentage = Math.round((phase / phases) * 100);
        const oldPercentage = 100 - rawPercentage;
        
        const phaseEnd = phase === phases ? days : currentDay + daysPerPhase - 1;
        
        schedule.push({
            phase,
            days: `${currentDay}-${phaseEnd}`,
            rawPercentage,
            oldPercentage,
            tips: getPhaseTips(phase, phases, currentDiet)
        });
        
        currentDay = phaseEnd + 1;
    }
    
    return schedule;
}

function getPhaseTips(phase, totalPhases, currentDiet) {
    const tips = {
        1: {
            zh: '開始時可以將生肉輕微加熱至室溫，增加香味。觀察貓咪的接受程度。',
            en: 'Start by warming raw meat to room temperature to enhance aroma. Observe acceptance.'
        },
        2: {
            zh: '如果貓咪適應良好，繼續增加生肉比例。注意糞便變化是正常的。',
            en: 'If adapting well, continue increasing raw portion. Stool changes are normal.'
        },
        mid: {
            zh: '這個階段貓咪應該開始習慣生肉質地。保持耐心，不要急於求成。',
            en: 'Cat should be getting used to raw texture. Be patient, don\'t rush.'
        },
        final: {
            zh: '接近完全轉換。如果出現任何問題，可以暫時停留在這個比例。',
            en: 'Near complete transition. If any issues arise, stay at this ratio temporarily.'
        },
        complete: {
            zh: '恭喜！完成轉換。繼續觀察貓咪的健康狀況和活力。',
            en: 'Congratulations! Transition complete. Continue monitoring health and vitality.'
        }
    };
    
    if (phase === 1) return tips[1];
    if (phase === 2) return tips[2];
    if (phase === totalPhases) return tips.complete;
    if (phase === totalPhases - 1) return tips.final;
    return tips.mid;
}

function displayTransitionPlan(schedule, currentDiet, days) {
    const dietLabels = {
        dry: '乾糧 Dry Food',
        canned: '罐頭 Canned Food',
        mixed: '混合餵食 Mixed Feeding'
    };
    
    const planHTML = `
        <div class="plan-header">
            <h3>📋 ${selectedCatForTransition.name} 的 ${days} 天轉換計劃</h3>
            <p>從 ${dietLabels[currentDiet]} 轉換至 PMR 生肉飲食</p>
            <button onclick="shareToInstagram()" class="instagram-cta">
                📷 分享到 Instagram Share to Instagram
            </button>
        </div>
        
        <div class="timeline">
            ${schedule.map(phase => `
                <div class="timeline-phase">
                    <div class="phase-header">
                        <span class="phase-number">第 ${phase.phase} 階段 Phase ${phase.phase}</span>
                        <span class="phase-days">第 ${phase.days} 天 Days ${phase.days}</span>
                    </div>
                    <div class="phase-ratio">
                        <div class="ratio-bar">
                            <div class="ratio-raw" style="width: ${phase.rawPercentage}%">
                                ${phase.rawPercentage}% PMR
                            </div>
                            <div class="ratio-old" style="width: ${phase.oldPercentage}%">
                                ${phase.oldPercentage}% 舊食物
                            </div>
                        </div>
                    </div>
                    <div class="phase-tips">
                        <p><strong>💡 建議：</strong></p>
                        <p>${phase.tips.zh}</p>
                        <p class="tip-en">${phase.tips.en}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="plan-actions">
            <button onclick="window.location.href='calculator.html#cat-${selectedCatForTransition.id}'" class="btn">
                查看每日份量 View Daily Portions
            </button>
            <button onclick="showHealthLog()" class="btn-secondary">
                健康觀察記錄 Health Log
            </button>
        </div>
    `;
    
    document.getElementById('planDisplay').innerHTML = planHTML;
    document.getElementById('planDisplay').style.display = 'block';
    document.getElementById('planDisplay').scrollIntoView({ behavior: 'smooth' });
}

function shareToInstagram() {
    // Generate shareable image data
    const catName = selectedCatForTransition.name;
    const plan = selectedCatForTransition.transitionPlan;
    
    // Create a simple text summary for sharing
    const shareText = `🐾 ${catName} 的 PMR 轉換計劃\n\n` +
        `${plan.speed} 天轉換計劃\n` +
        `從 ${document.getElementById('currentDiet').selectedOptions[0].text} 轉換至生肉飲食\n\n` +
        `由 @anymothings 提供\n` +
        `#PMR #生肉飲食 #貓咪健康 #香港貓奴`;
    
    // Show modal with sharing options
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <h3>📷 分享到 Instagram</h3>
            <div class="share-preview">
                <div class="share-card">
                    <div class="share-header">
                        <h4>🐾 AnyMoThings</h4>
                        <p>@anymothings</p>
                    </div>
                    <div class="share-body">
                        <h2>🐱 ${catName}</h2>
                        <p class="share-plan-title">${plan.speed} 天 PMR 轉換計劃</p>
                        <div class="share-stats">
                            <div class="share-stat">
                                <span class="stat-number">${plan.schedule.length}</span>
                                <span class="stat-label">階段</span>
                            </div>
                            <div class="share-stat">
                                <span class="stat-number">${plan.speed}</span>
                                <span class="stat-label">天</span>
                            </div>
                        </div>
                    </div>
                    <div class="share-footer">
                        <p>獵物模型生肉飲食 Prey Model Raw</p>
                        <p><strong>@anymothings</strong></p>
                    </div>
                </div>
            </div>
            <div class="share-text">
                <label>複製文字 Copy Text:</label>
                <textarea readonly id="shareTextArea">${shareText}</textarea>
                <button onclick="copyShareText()" class="btn">📋 複製 Copy</button>
            </div>
            <p class="share-instructions">
                💡 截圖上方卡片，配合文字發佈到 Instagram Story 或貼文<br>
                Screenshot the card above and post to Instagram Story or Feed
            </p>
            <div class="share-actions">
                <a href="https://www.instagram.com/anymothings/" target="_blank" class="instagram-link">
                    前往 Instagram Go to Instagram
                </a>
                <button onclick="closeShareModal()" class="btn-secondary">關閉 Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareModal();
        }
    });
}

function copyShareText() {
    const textarea = document.getElementById('shareTextArea');
    textarea.select();
    document.execCommand('copy');
    showMessage('已複製到剪貼板 Copied to clipboard!');
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

function showHealthLog() {
    window.location.href = `calculator.html#health-log-${selectedCatForTransition.id}`;
}

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 2000);
}
