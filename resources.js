// HK Cost Calculator
function calculateHKCost() {
    const weight = parseFloat(document.getElementById('costCatWeight').value);
    const activityLevel = parseFloat(document.getElementById('costActivityLevel').value);
    const source = document.getElementById('costSource').value;
    
    if (!weight || weight <= 0) {
        alert('請輸入有效的體重 Please enter a valid weight');
        return;
    }
    
    // Calculate daily food amount
    const dailyPercentage = activityLevel / 100;
    const dailyGrams = weight * 1000 * dailyPercentage;
    const monthlyKg = (dailyGrams * 30) / 1000;
    
    // Price ranges per kg (HK$)
    const priceRanges = {
        wetmarket: { min: 50, max: 80, label: '街市 Wet Market' },
        supermarket: { min: 80, max: 120, label: '超市 Supermarket' },
        petstore: { min: 100, max: 150, label: '寵物店 Pet Store' }
    };
    
    const selectedRange = priceRanges[source];
    const monthlyCostMin = Math.round(monthlyKg * selectedRange.min);
    const monthlyCostMax = Math.round(monthlyKg * selectedRange.max);
    const monthlyCostAvg = Math.round((monthlyCostMin + monthlyCostMax) / 2);
    
    // Comparison with other diets (estimated HK prices)
    const kibbleCost = Math.round(weight * 30 * 15); // ~HK$15/day for premium kibble
    const cannedCost = Math.round(weight * 30 * 25); // ~HK$25/day for quality canned
    
    // Display results
    const resultsDiv = document.getElementById('costResults');
    resultsDiv.innerHTML = `
        <h4>💰 每月成本估算 Monthly Cost Estimate</h4>
        
        <div class="cost-result-main">
            <div class="cost-source-label">${selectedRange.label}</div>
            <div class="cost-amount">HK$ ${monthlyCostMin} - ${monthlyCostMax}</div>
            <div class="cost-average">平均 Average: HK$ ${monthlyCostAvg}</div>
        </div>
        
        <div class="cost-breakdown-detail">
            <h5>詳細分析 Breakdown:</h5>
            <div class="cost-detail-row">
                <span>每日需求 Daily Amount:</span>
                <strong>${dailyGrams.toFixed(0)}g</strong>
            </div>
            <div class="cost-detail-row">
                <span>每月需求 Monthly Amount:</span>
                <strong>${monthlyKg.toFixed(2)}kg</strong>
            </div>
            <div class="cost-detail-row">
                <span>每公斤價格 Price per kg:</span>
                <strong>HK$ ${selectedRange.min}-${selectedRange.max}</strong>
            </div>
        </div>
        
        <div class="cost-comparison-section">
            <h5>📊 與其他飲食比較 Comparison with Other Diets</h5>
            <div class="comparison-bars">
                <div class="comparison-item">
                    <div class="comparison-label">
                        <span>🥩 PMR 生肉</span>
                        <span class="comparison-price">HK$ ${monthlyCostAvg}</span>
                    </div>
                    <div class="comparison-bar">
                        <div class="comparison-fill pmr-fill" style="width: ${(monthlyCostAvg / Math.max(monthlyCostAvg, kibbleCost, cannedCost)) * 100}%"></div>
                    </div>
                </div>
                
                <div class="comparison-item">
                    <div class="comparison-label">
                        <span>🍪 高級乾糧 Premium Kibble</span>
                        <span class="comparison-price">HK$ ${kibbleCost}</span>
                    </div>
                    <div class="comparison-bar">
                        <div class="comparison-fill kibble-fill" style="width: ${(kibbleCost / Math.max(monthlyCostAvg, kibbleCost, cannedCost)) * 100}%"></div>
                    </div>
                </div>
                
                <div class="comparison-item">
                    <div class="comparison-label">
                        <span>🥫 優質罐頭 Quality Canned</span>
                        <span class="comparison-price">HK$ ${cannedCost}</span>
                    </div>
                    <div class="comparison-bar">
                        <div class="comparison-fill canned-fill" style="width: ${(cannedCost / Math.max(monthlyCostAvg, kibbleCost, cannedCost)) * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="cost-insights">
            <h5>💡 成本洞察 Cost Insights:</h5>
            <ul>
                ${monthlyCostAvg < kibbleCost ? 
                    '<li>✅ PMR 比高級乾糧便宜 PMR is cheaper than premium kibble</li>' : 
                    '<li>⚠️ PMR 比高級乾糧貴，但可能節省長期醫療費用 PMR costs more upfront but may save on vet bills</li>'
                }
                ${monthlyCostAvg < cannedCost ? 
                    '<li>✅ PMR 比優質罐頭便宜 PMR is cheaper than quality canned food</li>' : 
                    '<li>⚠️ PMR 與優質罐頭價格相若 PMR costs similar to quality canned food</li>'
                }
                <li>💰 從街市購買可節省 20-40% Buying from wet markets saves 20-40%</li>
                <li>📦 批量購買和冷凍可進一步降低成本 Bulk buying and freezing reduces costs further</li>
                <li>🏥 長期可能減少因飲食相關疾病的醫療開支 May reduce diet-related health costs long-term</li>
            </ul>
        </div>
        
        <div class="cost-tips-box">
            <h5>🎯 省錢貼士 Money-Saving Tips:</h5>
            <ul>
                <li>與其他貓主合購整隻動物 Split whole animals with other cat owners</li>
                <li>選擇當季和本地肉類 Choose seasonal and local meats</li>
                <li>利用街市收市前的折扣 Take advantage of wet market closing discounts</li>
                <li>投資真空密封機延長保存期 Invest in vacuum sealer for longer storage</li>
            </ul>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Share Myth to Instagram
function shareMythToIG(mythId) {
    const myths = {
        'kibble-teeth': {
            title: '迷思：乾糧能清潔牙齒',
            titleEn: 'Myth: Kibble cleans teeth',
            reality: '研究顯示乾糧對牙齒清潔效果極有限。貓咪通常整顆吞下，沒有咀嚼動作。',
            realityEn: 'Studies show kibble has minimal teeth-cleaning effect. Cats usually swallow whole without chewing.'
        },
        'bacteria-risk': {
            title: '迷思：生肉一定會導致細菌感染',
            titleEn: 'Myth: Raw meat always causes infection',
            reality: '健康貓咪的胃酸pH值1-2，比人類更酸，能有效殺死大部分細菌。',
            realityEn: 'Healthy cats have stomach pH 1-2, more acidic than humans, killing most bacteria effectively.'
        },
        'vegetables': {
            title: '迷思：貓需要蔬菜',
            titleEn: 'Myth: Cats need vegetables',
            reality: '貓是專性肉食動物，生理上不需要植物性食物。',
            realityEn: 'Cats are obligate carnivores and do not biologically require plant matter.'
        },
        'detox': {
            title: '迷思：生肉飲食需要「排毒期」',
            titleEn: 'Myth: Raw diet requires detox period',
            reality: '沒有科學證據支持「排毒」概念。轉換期的變化是消化系統適應新食物。',
            realityEn: 'No scientific evidence supports "detox". Changes during transition are digestive adaptation.'
        },
        'cost': {
            title: '迷思：生肉飲食太貴了',
            titleEn: 'Myth: Raw feeding is too expensive',
            reality: '在香港，從街市購買的生肉成本可能與高級罐頭相若。',
            realityEn: 'In Hong Kong, raw meat from wet markets can cost similar to premium canned food.'
        },
        'bones': {
            title: '迷思：骨頭會卡喉或刺穿腸道',
            titleEn: 'Myth: Bones cause choking or perforation',
            reality: '生骨頭柔軟有彈性，貓咪天生會咀嚼。危險的是煮熟的骨頭。',
            realityEn: 'Raw bones are soft and flexible. Cats naturally chew them. Cooked bones are dangerous.'
        }
    };
    
    const myth = myths[mythId];
    if (!myth) return;
    
    // Create modal with shareable content
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="modal-header">
                <h3>📷 分享到 Instagram</h3>
                <button onclick="closeShareModal()" class="close-btn">✕</button>
            </div>
            
            <div class="share-preview">
                <div class="myth-share-card">
                    <div class="share-card-header">
                        <h4>❌ ${myth.title}</h4>
                        <p class="share-card-subtitle">${myth.titleEn}</p>
                    </div>
                    <div class="share-card-body">
                        <div class="reality-badge">✅ 現實 Reality</div>
                        <p class="reality-text">${myth.reality}</p>
                        <p class="reality-text-en">${myth.realityEn}</p>
                    </div>
                    <div class="share-card-footer">
                        <p>🐾 AnyMoThings</p>
                        <p>@anymothings</p>
                    </div>
                </div>
            </div>
            
            <div class="share-instructions">
                <h4>如何分享 How to Share:</h4>
                <ol>
                    <li>📸 截圖上方卡片 Screenshot the card above</li>
                    <li>📱 在 Instagram 發佈 Post on Instagram</li>
                    <li>🏷️ 標記 @anymothings Tag @anymothings</li>
                    <li>💬 使用以下文字 Use the caption below</li>
                </ol>
            </div>
            
            <div class="share-caption">
                <h4>建議文字 Suggested Caption:</h4>
                <div class="caption-box">
                    <p>${myth.title} ❌</p>
                    <p>${myth.titleEn}</p>
                    <p></p>
                    <p>✅ ${myth.reality}</p>
                    <p></p>
                    <p>#貓生肉飲食 #PMR #RawCatDiet #HongKongCats #貓奴 #CatHealth #AnyMoThings</p>
                    <p>@anymothings</p>
                </div>
                <button onclick="copyCaptionToClipboard('${mythId}')" class="btn">📋 複製文字 Copy Caption</button>
            </div>
            
            <button onclick="closeShareModal()" class="btn-secondary">關閉 Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareModal();
        }
    });
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

function copyCaptionToClipboard(mythId) {
    const myths = {
        'kibble-teeth': {
            title: '迷思：乾糧能清潔牙齒',
            titleEn: 'Myth: Kibble cleans teeth',
            reality: '研究顯示乾糧對牙齒清潔效果極有限。貓咪通常整顆吞下，沒有咀嚼動作。'
        },
        'bacteria-risk': {
            title: '迷思：生肉一定會導致細菌感染',
            titleEn: 'Myth: Raw meat always causes infection',
            reality: '健康貓咪的胃酸pH值1-2，比人類更酸，能有效殺死大部分細菌。'
        },
        'vegetables': {
            title: '迷思：貓需要蔬菜',
            titleEn: 'Myth: Cats need vegetables',
            reality: '貓是專性肉食動物，生理上不需要植物性食物。'
        },
        'detox': {
            title: '迷思：生肉飲食需要「排毒期」',
            titleEn: 'Myth: Raw diet requires detox period',
            reality: '沒有科學證據支持「排毒」概念。轉換期的變化是消化系統適應新食物。'
        },
        'cost': {
            title: '迷思：生肉飲食太貴了',
            titleEn: 'Myth: Raw feeding is too expensive',
            reality: '在香港，從街市購買的生肉成本可能與高級罐頭相若。'
        },
        'bones': {
            title: '迷思：骨頭會卡喉或刺穿腸道',
            titleEn: 'Myth: Bones cause choking or perforation',
            reality: '生骨頭柔軟有彈性，貓咪天生會咀嚼。危險的是煮熟的骨頭。'
        }
    };
    
    const myth = myths[mythId];
    if (!myth) return;
    
    const caption = `${myth.title} ❌
${myth.titleEn}

✅ ${myth.reality}

#貓生肉飲食 #PMR #RawCatDiet #HongKongCats #貓奴 #CatHealth #AnyMoThings
@anymothings`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(caption).then(() => {
        alert('✅ 已複製到剪貼簿！\nCopied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = caption;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ 已複製到剪貼簿！\nCopied to clipboard!');
    });
}
