// Cat profile management
let cats = [];
let editingCatId = null;

// Load cats from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCats();
    displayCats();
    
    // Allow Enter key in form fields
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && input.id !== 'catNotes') {
                e.preventDefault();
                saveCat();
            }
        });
    });
});

// Load cats from localStorage
function loadCats() {
    const stored = localStorage.getItem('rawCatDietCats');
    if (stored) {
        cats = JSON.parse(stored);
    }
}

// Save cats to localStorage
function saveCatsToStorage() {
    localStorage.setItem('rawCatDietCats', JSON.stringify(cats));
}

// Display all saved cats
function displayCats() {
    const container = document.getElementById('savedCats');
    
    if (cats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>😺 還沒有儲存的貓咪資料</p>
                <p>No saved cats yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cats.map(cat => `
        <div class="cat-card" id="cat-${cat.id}">
            <div class="cat-header">
                <h4>🐱 ${cat.name}</h4>
                <div class="cat-actions">
                    <button onclick="editCat('${cat.id}')" class="btn-icon" title="編輯 Edit">✏️</button>
                    <button onclick="deleteCat('${cat.id}')" class="btn-icon" title="刪除 Delete">🗑️</button>
                </div>
            </div>
            <div class="cat-info">
                <div class="info-row">
                    <span class="info-label">體重 Weight:</span>
                    <span class="info-value">${cat.weight} kg</span>
                </div>
                ${cat.age ? `
                <div class="info-row">
                    <span class="info-label">年齡 Age:</span>
                    <span class="info-value">${cat.age}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">活動程度 Activity:</span>
                    <span class="info-value">${getActivityLabel(cat.activityLevel)}</span>
                </div>
                ${cat.notes ? `
                <div class="info-row">
                    <span class="info-label">備註 Notes:</span>
                    <span class="info-value">${cat.notes}</span>
                </div>
                ` : ''}
                ${cat.transitionPlan ? `
                <div class="info-row">
                    <span class="info-label">轉換計劃:</span>
                    <span class="info-value">✓ ${cat.transitionPlan.speed} 天計劃</span>
                </div>
                ` : ''}
                ${cat.healthLogs && cat.healthLogs.length > 0 ? `
                <div class="info-row">
                    <span class="info-label">健康記錄:</span>
                    <span class="info-value">${cat.healthLogs.length} 條記錄</span>
                </div>
                ` : ''}
            </div>
            <div class="cat-card-actions">
                <button onclick="calculateForCat('${cat.id}')" class="btn-calculate">
                    📊 計算每日需求 Calculate Daily Needs
                </button>
                <button onclick="showBatchPrepPlanner('${cat.id}')" class="btn-batch-prep">
                    📦 每週備餐計劃 Weekly Batch Prep
                </button>
                <button onclick="showHealthLogModal('${cat.id}')" class="btn-health-log">
                    📋 健康記錄 Health Log
                </button>
            </div>
            <div id="results-${cat.id}" class="cat-results" style="display: none;"></div>
        </div>
    `).join('');
}

// Get activity level label
function getActivityLabel(level) {
    const labels = {
        '2': '低 Low (室內貓)',
        '3': '中 Medium (一般)',
        '4': '高 High (活躍/幼貓)'
    };
    return labels[level] || level;
}

// Show add cat form
function showAddCatForm() {
    editingCatId = null;
    document.getElementById('formTitle').textContent = '新增貓咪 Add New Cat';
    document.getElementById('saveBtn').textContent = '💾 儲存 Save';
    document.getElementById('catForm').style.display = 'block';
    document.getElementById('addCatBtn').style.display = 'none';
    
    // Clear form
    document.getElementById('catName').value = '';
    document.getElementById('catWeight').value = '4';
    document.getElementById('catAge').value = '';
    document.getElementById('activityLevel').value = '3';
    document.getElementById('catNotes').value = '';
    
    // Scroll to form
    document.getElementById('catForm').scrollIntoView({ behavior: 'smooth' });
}

// Cancel form
function cancelForm() {
    editingCatId = null;
    document.getElementById('catForm').style.display = 'none';
    document.getElementById('addCatBtn').style.display = 'block';
}

// Save cat (add or update)
function saveCat() {
    const name = document.getElementById('catName').value.trim();
    const weight = parseFloat(document.getElementById('catWeight').value);
    const age = document.getElementById('catAge').value.trim();
    const activityLevel = document.getElementById('activityLevel').value;
    const notes = document.getElementById('catNotes').value.trim();
    
    // Validate
    if (!name) {
        alert('請輸入貓咪名字 / Please enter cat name');
        return;
    }
    
    if (!weight || weight <= 0) {
        alert('請輸入有效的體重 / Please enter a valid weight');
        return;
    }
    
    const catData = {
        id: editingCatId || Date.now().toString(),
        name,
        weight,
        age,
        activityLevel,
        notes,
        createdAt: editingCatId ? cats.find(c => c.id === editingCatId).createdAt : new Date().toISOString()
    };
    
    if (editingCatId) {
        // Update existing cat
        const index = cats.findIndex(c => c.id === editingCatId);
        cats[index] = catData;
    } else {
        // Add new cat
        cats.push(catData);
    }
    
    saveCatsToStorage();
    displayCats();
    cancelForm();
    
    // Show success message
    showMessage(editingCatId ? '已更新貓咪資料 Cat updated!' : '已新增貓咪 Cat added!');
}

// Edit cat
function editCat(catId) {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    editingCatId = catId;
    document.getElementById('formTitle').textContent = '編輯貓咪 Edit Cat';
    document.getElementById('saveBtn').textContent = '💾 更新 Update';
    
    // Fill form
    document.getElementById('catName').value = cat.name;
    document.getElementById('catWeight').value = cat.weight;
    document.getElementById('catAge').value = cat.age || '';
    document.getElementById('activityLevel').value = cat.activityLevel;
    document.getElementById('catNotes').value = cat.notes || '';
    
    document.getElementById('catForm').style.display = 'block';
    document.getElementById('addCatBtn').style.display = 'none';
    
    // Scroll to form
    document.getElementById('catForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete cat
function deleteCat(catId) {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    if (confirm(`確定要刪除 ${cat.name} 的資料嗎？\nAre you sure you want to delete ${cat.name}?`)) {
        cats = cats.filter(c => c.id !== catId);
        saveCatsToStorage();
        displayCats();
        showMessage('已刪除貓咪資料 Cat deleted');
    }
}

// Calculate diet for specific cat
function calculateForCat(catId) {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    const weight = cat.weight;
    const activityLevel = parseFloat(cat.activityLevel);
    
    // Calculate daily food amount (2-4% of body weight)
    const dailyPercentage = activityLevel / 100;
    const totalDaily = weight * 1000 * dailyPercentage; // Convert to grams
    
    // Calculate ingredient breakdown using PMR 80/10/10 ratio
    const muscleMeat = totalDaily * 0.70;  // 70% pure muscle meat
    const heart = totalDaily * 0.10;        // 10% heart (counts as muscle, high in taurine)
    const bone = totalDaily * 0.10;         // 10% edible bone
    const liver = totalDaily * 0.05;        // 5% liver
    const otherOrgans = totalDaily * 0.05;  // 5% other secreting organs
    
    // Display results in cat card
    const resultsDiv = document.getElementById(`results-${catId}`);
    resultsDiv.innerHTML = `
        <div class="results-content">
            <h4>📊 ${cat.name} 的每日需求</h4>
            
            <div class="result-item-inline">
                <strong>每日總量 Total Daily:</strong>
                <span>${totalDaily.toFixed(0)}g</span>
            </div>
            
            ${generateBalanceIndicator(muscleMeat, heart, bone, liver, otherOrgans, totalDaily)}
            
            <div class="ingredients-breakdown">
                <div class="ingredient-row">
                    <span>🥩 肌肉肉類 Muscle Meat (70%):</span>
                    <strong>${muscleMeat.toFixed(0)}g</strong>
                </div>
                <div class="ingredient-row">
                    <span>🫀 心臟 Heart (10%):</span>
                    <strong>${heart.toFixed(0)}g</strong>
                </div>
                <div class="ingredient-row">
                    <span>🦴 可食用骨頭 Bone (10%):</span>
                    <strong>${bone.toFixed(0)}g</strong>
                </div>
                <div class="ingredient-row">
                    <span>🍖 肝臟 Liver (5%):</span>
                    <strong>${liver.toFixed(0)}g</strong>
                </div>
                <div class="ingredient-row">
                    <span>🫘 其他內臟 Other Organs (5%):</span>
                    <strong>${otherOrgans.toFixed(0)}g</strong>
                </div>
            </div>
            
            ${generatePMRTips(cat)}
            
            <div class="tips-box">
                <p>💡 建議分成 2-3 餐餵食</p>
                <p>Divide into 2-3 meals per day</p>
            </div>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show temporary message
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


// Health Observation Log Functions
function showHealthLogModal(catId) {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    const modal = document.createElement('div');
    modal.className = 'health-log-modal';
    modal.innerHTML = `
        <div class="health-log-content">
            <div class="modal-header">
                <h3>📊 ${cat.name} 的健康觀察記錄</h3>
                <button onclick="closeHealthLogModal()" class="close-btn">✕</button>
            </div>
            
            <div class="health-log-form">
                <h4>新增觀察記錄 Add Observation</h4>
                
                <div class="form-group">
                    <label>日期 Date:</label>
                    <input type="date" id="logDate" value="${new Date().toISOString().split('T')[0]}" />
                </div>
                
                <div class="form-group">
                    <label>糞便質量 Stool Quality:</label>
                    <select id="stoolQuality">
                        <option value="">-- 選擇 Select --</option>
                        <option value="5">😊 完美 Perfect (成形、不太硬不太軟)</option>
                        <option value="4">🙂 良好 Good (稍軟但成形)</option>
                        <option value="3">😐 一般 Fair (較軟或較硬)</option>
                        <option value="2">😟 較差 Poor (很軟或很硬)</option>
                        <option value="1">😰 差 Bad (腹瀉或嚴重便秘)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>皮毛狀況 Coat Condition:</label>
                    <select id="coatCondition">
                        <option value="">-- 選擇 Select --</option>
                        <option value="5">✨ 極佳 Excellent (有光澤、柔軟)</option>
                        <option value="4">😊 良好 Good (健康)</option>
                        <option value="3">😐 一般 Fair (正常)</option>
                        <option value="2">😟 較差 Poor (乾燥或油膩)</option>
                        <option value="1">😰 差 Bad (脫毛或皮膚問題)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>能量水平 Energy Level:</label>
                    <select id="energyLevel">
                        <option value="">-- 選擇 Select --</option>
                        <option value="5">⚡ 非常活躍 Very Active</option>
                        <option value="4">😊 活躍 Active</option>
                        <option value="3">😐 正常 Normal</option>
                        <option value="2">😴 較低 Low</option>
                        <option value="1">😰 無精打采 Lethargic</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>備註 Notes:</label>
                    <textarea id="logNotes" rows="3" placeholder="任何觀察或變化 Any observations or changes"></textarea>
                </div>
                
                <button onclick="saveHealthLog('${catId}')" class="btn">💾 儲存記錄 Save Log</button>
            </div>
            
            <div class="health-log-history">
                <h4>歷史記錄 History</h4>
                <div id="logHistory">
                    ${displayHealthLogHistory(cat)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeHealthLogModal();
        }
    });
}

function displayHealthLogHistory(cat) {
    if (!cat.healthLogs || cat.healthLogs.length === 0) {
        return '<p class="empty-state">還沒有記錄 No logs yet</p>';
    }
    
    // Sort by date descending
    const sortedLogs = [...cat.healthLogs].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    return sortedLogs.map(log => `
        <div class="log-entry">
            <div class="log-header">
                <strong>📅 ${new Date(log.date).toLocaleDateString('zh-HK')}</strong>
                <button onclick="deleteHealthLog('${cat.id}', '${log.id}')" class="delete-log-btn">🗑️</button>
            </div>
            <div class="log-details">
                ${log.stoolQuality ? `<span class="log-badge">💩 ${getQualityLabel(log.stoolQuality)}</span>` : ''}
                ${log.coatCondition ? `<span class="log-badge">✨ ${getQualityLabel(log.coatCondition)}</span>` : ''}
                ${log.energyLevel ? `<span class="log-badge">⚡ ${getQualityLabel(log.energyLevel)}</span>` : ''}
            </div>
            ${log.notes ? `<p class="log-notes">${log.notes}</p>` : ''}
        </div>
    `).join('');
}

function getQualityLabel(value) {
    const labels = {
        '5': '極佳 Excellent',
        '4': '良好 Good',
        '3': '一般 Fair',
        '2': '較差 Poor',
        '1': '差 Bad'
    };
    return labels[value] || value;
}

function saveHealthLog(catId) {
    const date = document.getElementById('logDate').value;
    const stoolQuality = document.getElementById('stoolQuality').value;
    const coatCondition = document.getElementById('coatCondition').value;
    const energyLevel = document.getElementById('energyLevel').value;
    const notes = document.getElementById('logNotes').value.trim();
    
    if (!date) {
        alert('請選擇日期 Please select a date');
        return;
    }
    
    if (!stoolQuality && !coatCondition && !energyLevel && !notes) {
        alert('請至少填寫一項觀察 Please fill in at least one observation');
        return;
    }
    
    const catIndex = cats.findIndex(c => c.id === catId);
    if (catIndex === -1) return;
    
    if (!cats[catIndex].healthLogs) {
        cats[catIndex].healthLogs = [];
    }
    
    const logEntry = {
        id: Date.now().toString(),
        date,
        stoolQuality,
        coatCondition,
        energyLevel,
        notes,
        createdAt: new Date().toISOString()
    };
    
    cats[catIndex].healthLogs.push(logEntry);
    saveCatsToStorage();
    
    showMessage('已儲存健康記錄 Health log saved!');
    
    // Refresh the modal
    closeHealthLogModal();
    setTimeout(() => showHealthLogModal(catId), 300);
}

function deleteHealthLog(catId, logId) {
    if (!confirm('確定要刪除這條記錄嗎？\nDelete this log entry?')) {
        return;
    }
    
    const catIndex = cats.findIndex(c => c.id === catId);
    if (catIndex === -1) return;
    
    if (cats[catIndex].healthLogs) {
        cats[catIndex].healthLogs = cats[catIndex].healthLogs.filter(log => log.id !== logId);
        saveCatsToStorage();
        
        showMessage('已刪除記錄 Log deleted');
        
        // Refresh the modal
        closeHealthLogModal();
        setTimeout(() => showHealthLogModal(catId), 300);
    }
}

function closeHealthLogModal() {
    const modal = document.querySelector('.health-log-modal');
    if (modal) {
        modal.remove();
    }
}

// Check for hash navigation to health log
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash.startsWith('#health-log-')) {
        const catId = hash.replace('#health-log-', '');
        setTimeout(() => showHealthLogModal(catId), 500);
    }
});


// Nutrient Coverage Confidence Indicator
function generateBalanceIndicator(muscle, heart, bone, liver, otherOrgans, total) {
    const ratios = {
        muscle: (muscle / total) * 100,
        heart: (heart / total) * 100,
        bone: (bone / total) * 100,
        liver: (liver / total) * 100,
        otherOrgans: (otherOrgans / total) * 100
    };
    
    let status = 'balanced';
    let warnings = [];
    let tips = [];
    
    // Check PMR compliance
    const totalMuscle = ratios.muscle + ratios.heart;
    
    if (totalMuscle < 75 || totalMuscle > 85) {
        status = 'warning';
        warnings.push('肌肉肉類比例偏離標準 Muscle meat ratio off target');
    }
    
    if (ratios.bone < 8 || ratios.bone > 12) {
        status = 'warning';
        warnings.push('骨頭比例需要調整 Bone ratio needs adjustment');
    }
    
    if (ratios.liver < 4 || ratios.liver > 6) {
        status = 'warning';
        warnings.push('肝臟比例需要調整 Liver ratio needs adjustment');
    }
    
    if (ratios.heart < 8) {
        warnings.push('⚠️ 心臟含量偏低，牛磺酸可能不足 Low heart = taurine risk');
    }
    
    if (ratios.liver > 6) {
        warnings.push('⚠️ 肝臟過多可能導致軟便 Too much liver may cause loose stool');
    }
    
    // Generate tips
    if (status === 'balanced') {
        tips.push('✅ PMR 比例符合標準 PMR ratios are on target');
        tips.push('💡 記得輪換不同肉類來源 Remember to rotate protein sources');
    }
    
    const statusClass = status === 'balanced' ? 'balance-good' : 'balance-warning';
    const statusIcon = status === 'balanced' ? '✅' : '⚠️';
    const statusText = status === 'balanced' ? '營養均衡 Balanced' : '需要注意 Check Ratios';
    
    return `
        <div class="balance-indicator ${statusClass}">
            <div class="balance-header">
                <span class="balance-icon">${statusIcon}</span>
                <strong>${statusText}</strong>
            </div>
            <div class="balance-details">
                <div class="ratio-display">
                    <span>肌肉 Muscle: ${totalMuscle.toFixed(1)}%</span>
                    <span>骨頭 Bone: ${ratios.bone.toFixed(1)}%</span>
                    <span>內臟 Organs: ${(ratios.liver + ratios.otherOrgans).toFixed(1)}%</span>
                </div>
            </div>
            ${warnings.length > 0 ? `
                <div class="balance-warnings">
                    ${warnings.map(w => `<p class="warning-item">${w}</p>`).join('')}
                </div>
            ` : ''}
            ${tips.length > 0 ? `
                <div class="balance-tips">
                    ${tips.map(t => `<p class="tip-item">${t}</p>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Common PMR Mistake Detector
function generatePMRTips(cat) {
    const mistakes = [];
    
    // Check feeding history if available
    if (cat.healthLogs && cat.healthLogs.length > 0) {
        const recentLogs = cat.healthLogs.slice(-7); // Last 7 entries
        
        // Check for consistent stool issues
        const poorStool = recentLogs.filter(log => log.stoolQuality && parseInt(log.stoolQuality) <= 2);
        if (poorStool.length >= 3) {
            mistakes.push({
                icon: '💩',
                title: '糞便問題持續 Persistent Stool Issues',
                message: '可能原因：肝臟過多、骨頭過多或轉換太快',
                suggestion: '建議：減少肝臟至3-4%，確保骨頭不超過10%'
            });
        }
    }
    
    // Check cat age for specific warnings
    if (cat.age) {
        const ageStr = cat.age.toLowerCase();
        if (ageStr.includes('幼') || ageStr.includes('kitten') || ageStr.includes('月') || ageStr.includes('month')) {
            mistakes.push({
                icon: '🐱',
                title: '幼貓特別注意 Kitten Special Care',
                message: '幼貓需要更高的鈣質和能量',
                suggestion: '建議：增加骨頭至12-15%，每日餵食3-4次'
            });
        }
        
        if (ageStr.includes('老') || ageStr.includes('senior') || parseInt(ageStr) >= 10) {
            mistakes.push({
                icon: '👴',
                title: '老年貓注意 Senior Cat Care',
                message: '老年貓可能需要更容易消化的食物',
                suggestion: '建議：絞碎肉類，減少大塊骨頭，監測腎功能'
            });
        }
    }
    
    // General PMR tips
    const generalTips = [
        {
            icon: '🔄',
            title: '輪換蛋白質 Rotate Proteins',
            message: '不要只餵單一肉類',
            suggestion: '建議：每週輪換雞、牛、鴨、鹿、兔、魚等不同來源'
        },
        {
            icon: '❄️',
            title: '香港氣候提醒 HK Climate Reminder',
            message: '炎熱潮濕天氣下細菌繁殖快',
            suggestion: '建議：餵食後30分鐘內清理剩餘食物'
        }
    ];
    
    // Combine mistakes and general tips
    const allTips = [...mistakes, ...generalTips.slice(0, 2)];
    
    if (allTips.length === 0) return '';
    
    return `
        <div class="pmr-tips-section">
            <h5>💡 個人化建議 Personalized Tips</h5>
            ${allTips.map(tip => `
                <div class="pmr-tip-card">
                    <div class="tip-header">
                        <span class="tip-icon">${tip.icon}</span>
                        <strong>${tip.title}</strong>
                    </div>
                    <p class="tip-message">${tip.message}</p>
                    <p class="tip-suggestion">${tip.suggestion}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Weekly Batch Prep Planner
function showBatchPrepPlanner(catId) {
    const cat = cats.find(c => c.id === catId);
    if (!cat) return;
    
    const weight = cat.weight;
    const activityLevel = parseFloat(cat.activityLevel);
    const dailyPercentage = activityLevel / 100;
    const dailyTotal = weight * 1000 * dailyPercentage;
    
    // Calculate weekly amounts
    const weeklyTotal = dailyTotal * 7;
    const weeklyMuscle = weeklyTotal * 0.70;
    const weeklyHeart = weeklyTotal * 0.10;
    const weeklyBone = weeklyTotal * 0.10;
    const weeklyLiver = weeklyTotal * 0.05;
    const weeklyOtherOrgans = weeklyTotal * 0.05;
    
    // Container calculations
    const portionsPerDay = 2; // Default
    const totalPortions = portionsPerDay * 7;
    const portionSize = dailyTotal / portionsPerDay;
    
    // Freezer space estimate (rough)
    const freezerSpace = Math.ceil(weeklyTotal / 1000 * 1.5); // liters, accounting for packaging
    
    const modal = document.createElement('div');
    modal.className = 'batch-prep-modal';
    modal.innerHTML = `
        <div class="batch-prep-content">
            <div class="modal-header">
                <h3>📦 ${cat.name} 的每週備餐計劃</h3>
                <button onclick="closeBatchPrepModal()" class="close-btn">✕</button>
            </div>
            
            <div class="batch-prep-body">
                <div class="prep-summary">
                    <h4>每週總量 Weekly Total</h4>
                    <div class="summary-stat">
                        <span class="stat-label">總重量 Total Weight:</span>
                        <span class="stat-value">${weeklyTotal.toFixed(0)}g (${(weeklyTotal/1000).toFixed(2)}kg)</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-label">份數 Portions:</span>
                        <span class="stat-value">${totalPortions} 份 (每份 ${portionSize.toFixed(0)}g)</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-label">預估冷凍空間 Freezer Space:</span>
                        <span class="stat-value">約 ${freezerSpace} 公升 ~${freezerSpace}L</span>
                    </div>
                </div>
                
                <div class="shopping-list">
                    <h4>🛒 採購清單 Shopping List</h4>
                    <div class="ingredient-list">
                        <div class="ingredient-item-prep">
                            <span class="ingredient-icon">🥩</span>
                            <div class="ingredient-details">
                                <strong>肌肉肉類 Muscle Meat</strong>
                                <span>${weeklyMuscle.toFixed(0)}g (${(weeklyMuscle/1000).toFixed(2)}kg)</span>
                            </div>
                        </div>
                        <div class="ingredient-item-prep">
                            <span class="ingredient-icon">🫀</span>
                            <div class="ingredient-details">
                                <strong>心臟 Heart</strong>
                                <span>${weeklyHeart.toFixed(0)}g (${(weeklyHeart/1000).toFixed(2)}kg)</span>
                            </div>
                        </div>
                        <div class="ingredient-item-prep">
                            <span class="ingredient-icon">🦴</span>
                            <div class="ingredient-details">
                                <strong>可食用骨頭 Edible Bone</strong>
                                <span>${weeklyBone.toFixed(0)}g (${(weeklyBone/1000).toFixed(2)}kg)</span>
                                <small>例如：雞翼尖、雞頸 e.g., chicken wing tips, necks</small>
                            </div>
                        </div>
                        <div class="ingredient-item-prep">
                            <span class="ingredient-icon">🍖</span>
                            <div class="ingredient-details">
                                <strong>肝臟 Liver</strong>
                                <span>${weeklyLiver.toFixed(0)}g (${(weeklyLiver/1000).toFixed(2)}kg)</span>
                            </div>
                        </div>
                        <div class="ingredient-item-prep">
                            <span class="ingredient-icon">🫘</span>
                            <div class="ingredient-details">
                                <strong>其他內臟 Other Organs</strong>
                                <span>${weeklyOtherOrgans.toFixed(0)}g (${(weeklyOtherOrgans/1000).toFixed(2)}kg)</span>
                                <small>腎臟、脾臟等 Kidney, spleen, etc.</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="prep-instructions">
                    <h4>📝 備餐步驟 Prep Instructions</h4>
                    <ol>
                        <li>購買所有食材並立即冷藏 Purchase all ingredients and refrigerate immediately</li>
                        <li>準備 ${totalPortions} 個密封容器或袋子 Prepare ${totalPortions} sealed containers or bags</li>
                        <li>將每日份量分成 ${portionsPerDay} 份 Divide daily portions into ${portionsPerDay} servings</li>
                        <li>每份包含所有成分的正確比例 Each portion contains correct ratios of all ingredients</li>
                        <li>標記日期和貓咪名字 Label with date and cat name</li>
                        <li>冷凍保存，每天取出解凍 Freeze and thaw daily as needed</li>
                    </ol>
                </div>
                
                <div class="hk-storage-tips">
                    <h4>🌡️ 香港儲存建議 HK Storage Tips</h4>
                    <div class="storage-tip">
                        <strong>小型冰箱模式 Small Freezer Mode:</strong>
                        <p>如果冷凍空間有限，考慮準備3-4天份量，更頻繁採購</p>
                        <p>If freezer space is limited, prepare 3-4 days worth and shop more frequently</p>
                    </div>
                    <div class="storage-tip">
                        <strong>炎熱天氣 Hot Weather:</strong>
                        <p>從街市購買後，使用保冷袋運送，30分鐘內冷藏</p>
                        <p>Use cooler bag from wet market, refrigerate within 30 minutes</p>
                    </div>
                    <div class="storage-tip">
                        <strong>停電預防 Power Outage:</strong>
                        <p>保留冰塊或冰磚，緊急時保持低溫</p>
                        <p>Keep ice packs for emergencies to maintain cold temperature</p>
                    </div>
                </div>
                
                <div class="cost-estimate">
                    <h4>💰 預估成本 Cost Estimate (HK$)</h4>
                    <div class="cost-breakdown">
                        <div class="cost-item">
                            <span>街市 Wet Market:</span>
                            <span>HK$${Math.round(weeklyTotal / 1000 * 50)}-${Math.round(weeklyTotal / 1000 * 80)}/週</span>
                        </div>
                        <div class="cost-item">
                            <span>超市 Supermarket:</span>
                            <span>HK$${Math.round(weeklyTotal / 1000 * 80)}-${Math.round(weeklyTotal / 1000 * 120)}/週</span>
                        </div>
                        <div class="cost-item">
                            <span>寵物店 Pet Store:</span>
                            <span>HK$${Math.round(weeklyTotal / 1000 * 100)}-${Math.round(weeklyTotal / 1000 * 150)}/週</span>
                        </div>
                    </div>
                    <p class="cost-note">💡 價格因肉類種類和來源而異 Prices vary by meat type and source</p>
                </div>
            </div>
            
            <div class="batch-prep-actions">
                <button onclick="printBatchPrep()" class="btn">🖨️ 列印清單 Print List</button>
                <button onclick="closeBatchPrepModal()" class="btn-secondary">關閉 Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBatchPrepModal();
        }
    });
}

function closeBatchPrepModal() {
    const modal = document.querySelector('.batch-prep-modal');
    if (modal) {
        modal.remove();
    }
}

function printBatchPrep() {
    window.print();
}
