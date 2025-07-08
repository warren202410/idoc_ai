// 聊天页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.message-send-btn');
    const chatBody = document.querySelector('.chat-body');
    const suggestionToggleBtn = document.getElementById('suggestion-toggle-btn');
    const contextToggleBtn = document.getElementById('context-toggle-btn');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const contextBar = document.getElementById('context-bar');
    const autocompleteContainer = document.getElementById('autocomplete-container');
    
    // 工具函数: 可展开区域控制
    window.toggleExpandable = function(element) {
        const content = element.nextElementSibling;
        const icon = element.querySelector('i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            content.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    };
    
    // 工具函数: 选择操作
    window.selectAction = function(action) {
        if (messageInput) {
            messageInput.value = action;
            messageInput.focus();
            messageInput.dispatchEvent(new Event('input'));
        }
    };
    
    // 初始化聊天功能
    if (messageInput && sendButton && chatBody) {
        // 自适应高度输入框
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // 自动完成功能
            const query = this.value.trim();
            if (query.length > 2) {
                showAutocomplete(query);
            } else {
                hideAutocomplete();
            }
        });
        
        // 发送消息处理
        sendButton.addEventListener('click', sendMessage);
        
        // 快捷键发送: Enter (不带Shift)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // 智能建议显示切换
        if (suggestionToggleBtn && suggestionsContainer) {
            suggestionToggleBtn.addEventListener('click', function() {
                if (suggestionsContainer.style.display === 'none') {
                    suggestionsContainer.style.display = 'block';
                    this.classList.add('active');
                } else {
                    suggestionsContainer.style.display = 'none';
                    this.classList.remove('active');
                }
            });
        }
        
        // 上下文参考显示切换
        if (contextToggleBtn && contextBar) {
            contextToggleBtn.addEventListener('click', function() {
                if (contextBar.style.display === 'none') {
                    contextBar.style.display = 'block';
                    this.classList.add('active');
                } else {
                    contextBar.style.display = 'none';
                    this.classList.remove('active');
                }
            });
        }
        
        // 建议提示点击事件
        const suggestionPills = document.querySelectorAll('.suggestion-pill');
        suggestionPills.forEach(pill => {
            pill.addEventListener('click', function() {
                messageInput.value = this.textContent;
                messageInput.focus();
                messageInput.dispatchEvent(new Event('input'));
            });
        });
        
        // 在页面加载后显示AI欢迎消息
        setTimeout(showProactiveAIMessage, 1000);
    }
    
    // 聊天历史记录过滤器
    const historyFilters = document.querySelectorAll('.history-filter');
    if (historyFilters.length > 0) {
        historyFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                historyFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                console.log(`Filter selected: ${this.textContent}`);
            });
        });
    }
    
    // 聊天列表项选择
    const chatItems = document.querySelectorAll('.chat-item');
    if (chatItems.length > 0) {
        chatItems.forEach(item => {
            item.addEventListener('click', function() {
                chatItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                console.log(`Chat selected: ${this.querySelector('.chat-item-name').textContent}`);
            });
        });
    }
    
    // 聊天历史项点击
    const historyItems = document.querySelectorAll('.history-item');
    if (historyItems.length > 0) {
        historyItems.forEach(item => {
            item.addEventListener('click', function() {
                console.log(`History item selected: ${this.querySelector('.history-item-title').textContent}`);
            });
        });
    }
    
    // 显示自动完成建议
    function showAutocomplete(query) {
        if (!autocompleteContainer) return;
        
        // 示例自动完成建议
        const suggestions = [
            '这份文档中的主要风险是什么？',
            '找出违反公司政策的条款',
            '提取所有付款条件',
            '总结最重要的三个条款',
            '识别不利于我方的条件'
        ];
        
        // 查找匹配项
        const matches = suggestions.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );
        
        if (matches.length > 0) {
            let html = '';
            matches.forEach(item => {
                html += `<div class="autocomplete-item">${item}</div>`;
            });
            
            autocompleteContainer.innerHTML = html;
            autocompleteContainer.classList.add('show');
            
            // 绑定点击事件
            const items = document.querySelectorAll('.autocomplete-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    messageInput.value = this.textContent;
                    hideAutocomplete();
                    messageInput.focus();
                });
            });
        } else {
            hideAutocomplete();
        }
    }
    
    // 隐藏自动完成建议
    function hideAutocomplete() {
        if (autocompleteContainer) {
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.classList.remove('show');
        }
    }
    
    // 发送消息
    function sendMessage() {
        if (!messageInput || !chatBody) return;
        
        const message = messageInput.value.trim();
        if (message) {
            // 获取当前时间
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;
            
            // 添加用户消息到聊天窗口
            const messageElement = document.createElement('div');
            messageElement.className = 'message message-user';
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <div class="message-sender">您</div>
                        <div class="message-time">${timeString}</div>
                    </div>
                    <div class="message-body">
                        <p>${message}</p>
                    </div>
                </div>
                <div class="message-avatar">
                    <div class="message-avatar-placeholder">
                        您
                    </div>
                </div>
            `;
            chatBody.appendChild(messageElement);
            
            // 清除输入框
            messageInput.value = '';
            messageInput.style.height = 'auto';
            hideAutocomplete();
            
            // 滚动到底部
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // 显示AI正在输入的指示器
            showTypingIndicator();
            
            // 模拟AI响应
            setTimeout(function() {
                // 移除输入指示器
                removeTypingIndicator();
                
                // 添加AI响应
                const responseElement = document.createElement('div');
                responseElement.className = 'message';
                
                // 确定响应类型
                let responseContent = '';
                
                // 基于关键词匹配响应类型
                const lowerMessage = message.toLowerCase();
                if (lowerMessage.includes('合同') || lowerMessage.includes('协议') || lowerMessage.includes('条款')) {
                    responseContent = getContractResponse();
                } else if (lowerMessage.includes('财务') || lowerMessage.includes('报表') || lowerMessage.includes('成本')) {
                    responseContent = getFinancialResponse();
                } else if (lowerMessage.includes('比较') || lowerMessage.includes('对比') || lowerMessage.includes('差异')) {
                    responseContent = getComparisonResponse();
                } else if (lowerMessage.includes('风险') || lowerMessage.includes('问题')) {
                    responseContent = getRiskResponse();
                } else if (lowerMessage.includes('摘要') || lowerMessage.includes('总结')) {
                    responseContent = getSummaryResponse();
                } else {
                    responseContent = getGeneralResponse();
                }
                
                responseElement.innerHTML = `
                    <div class="message-avatar">
                        <div class="message-avatar-placeholder">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <div class="message-sender">iDOC 智能助手</div>
                            <div class="message-time">${timeString}</div>
                        </div>
                        <div class="message-body">
                            ${responseContent}
                        </div>
                    </div>
                `;
                chatBody.appendChild(responseElement);
                
                // 滚动到底部
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // 在复杂查询后展示上下文参考
                if (contextBar && message.length > 15 && contextBar.style.display === 'none') {
                    setTimeout(() => {
                        contextBar.style.display = 'block';
                        if (contextToggleBtn) contextToggleBtn.classList.add('active');
                    }, 500);
                }
                
                // 在回复后显示相关建议
                if (suggestionsContainer && suggestionsContainer.style.display === 'none') {
                    setTimeout(() => {
                        suggestionsContainer.style.display = 'block';
                        if (suggestionToggleBtn) suggestionToggleBtn.classList.add('active');
                    }, 800);
                }
            }, 1500);
        }
    }
    
    // 显示AI正在输入的指示器
    function showTypingIndicator() {
        if (!chatBody) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message typing-message';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <div class="message-avatar-placeholder">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatBody.appendChild(typingElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // 移除AI正在输入的指示器
    function removeTypingIndicator() {
        const typingMessages = document.querySelectorAll('.typing-message');
        typingMessages.forEach(msg => msg.remove());
    }
    
    // 显示主动AI欢迎消息
    function showProactiveAIMessage() {
        if (!chatBody) return;
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        const welcomeElement = document.createElement('div');
        welcomeElement.className = 'message';
        welcomeElement.innerHTML = `
            <div class="message-avatar">
                <div class="message-avatar-placeholder">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">iDOC 智能助手</div>
                    <div class="message-time">${timeString}</div>
                </div>
                <div class="message-body">
                    <p>您好！我是您的iDOC智能文档助手。我注意到您最近上传了一份采购合同文件。我可以帮您：</p>
                    <ul>
                        <li>分析合同中的关键条款</li>
                        <li>识别潜在的风险条款</li>
                        <li>提取重要日期和期限</li>
                        <li>与以往合同进行比较</li>
                    </ul>
                    <p>您现在需要什么帮助？您也可以点击下方的<i class="fas fa-magic text-primary"></i>按钮查看建议，或<i class="fas fa-lightbulb text-primary"></i>按钮查看相关文档。</p>
                </div>
            </div>
        `;
        chatBody.appendChild(welcomeElement);
        
        // 滚动到底部
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // 合同分析响应模板
    function getContractResponse() {
        return `
            <div class="ai-response-section">
                <p>我已完成对<span class="doc-reference" data-doc-id="doc-123">《采购合同2025-XC35》</span>的全面分析。以下是关键发现：</p>
                
                <div class="analysis-highlights">
                    <div class="highlight-item critical">
                        <i class="fas fa-exclamation-circle text-danger"></i>
                        <div>
                            <strong>高风险条款</strong>
                            <p>第12条款设置了不合理的付款条件，要求预付70%且无保障机制</p>
                        </div>
                    </div>
                    <div class="highlight-item warning">
                        <i class="fas fa-exclamation-triangle text-warning"></i>
                        <div>
                            <strong>潜在风险</strong>
                            <p>交付时间条款(第8条)与附录B时间表存在冲突</p>
                        </div>
                    </div>
                    <div class="highlight-item opportunity">
                        <i class="fas fa-lightbulb text-success"></i>
                        <div>
                            <strong>优化机会</strong>
                            <p>可以通过修改第15条知识产权条款增强保护力度</p>
                        </div>
                    </div>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>详细分析（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <table class="analysis-table mt-2">
                            <tr>
                                <th>条款</th>
                                <th>问题</th>
                                <th>风险等级</th>
                                <th>建议</th>
                            </tr>
                            <tr>
                                <td>第12条：付款条件</td>
                                <td>要求预付70%且无保障机制</td>
                                <td><span class="badge bg-danger">高</span></td>
                                <td>修改为分阶段付款，每阶段与可交付成果绑定</td>
                            </tr>
                            <tr>
                                <td>第8条：交付时间</td>
                                <td>与附录B冲突</td>
                                <td><span class="badge bg-warning">中</span></td>
                                <td>统一时间表并增加明确的里程碑</td>
                            </tr>
                            <tr>
                                <td>第15条：知识产权</td>
                                <td>条款过于宽泛</td>
                                <td><span class="badge bg-info">低</span></td>
                                <td>具体列明权益范围</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <p class="mt-3">我可以帮您：</p>
                <div class="action-buttons">
                    <button class="action-button" onclick="selectAction('生成详细分析报告')">
                        <i class="fas fa-file-alt"></i> 生成详细分析报告
                    </button>
                    <button class="action-button" onclick="selectAction('起草修改建议')">
                        <i class="fas fa-edit"></i> 起草修改建议
                    </button>
                    <button class="action-button" onclick="selectAction('比较标准合同')">
                        <i class="fas fa-balance-scale"></i> 与标准合同比较
                    </button>
                </div>
            </div>
        `;
    }
    
    // 财务分析响应模板
    function getFinancialResponse() {
        return `
            <div class="ai-finance-analysis">
                <p>我已分析了<span class="doc-reference" data-doc-id="fin-456">《Q3财务报表2025》</span>，发现以下关键指标和趋势：</p>
                
                <div class="metrics-summary">
                    <div class="metric-card">
                        <div class="metric-value up">+15%</div>
                        <div class="metric-label">季度收入</div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up text-success"></i> 同比增长
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value down">-2%</div>
                        <div class="metric-label">利润率</div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-down text-danger"></i> 环比下降
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value up">+27%</div>
                        <div class="metric-label">研发投入</div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up text-success"></i> 同比增长
                        </div>
                    </div>
                    
                    <div class="metric-card warning">
                        <div class="metric-value up">+8.3%</div>
                        <div class="metric-label">运营成本</div>
                        <div class="metric-trend">
                            <i class="fas fa-exclamation-triangle text-warning"></i> 超出预算
                        </div>
                    </div>
                </div>
                
                <div class="insights-container">
                    <h5><i class="fas fa-lightbulb text-warning"></i> 核心洞察</h5>
                    <ul class="insights-list">
                        <li>虽然收入增长强劲，但利润率下降表明成本控制存在问题</li>
                        <li>运营成本超出预算，主要集中在供应链和物流环节</li>
                        <li>研发投入大幅增加，预计将在未来2-3个季度产出新产品线</li>
                    </ul>
                </div>
                
                <p class="recommendation">
                    <i class="fas fa-check-circle text-primary"></i> <strong>建议：</strong> 实施供应链优化计划，重点关注物流成本控制和供应商协议重新谈判，预计可将运营成本降低5-7%。
                </p>
                
                <div class="action-buttons">
                    <button class="action-button" onclick="selectAction('生成详细财务分析')">
                        <i class="fas fa-chart-pie"></i> 详细财务分析
                    </button>
                    <button class="action-button" onclick="selectAction('成本优化建议')">
                        <i class="fas fa-search-dollar"></i> 成本优化建议
                    </button>
                    <button class="action-button" onclick="selectAction('预测下季度趋势')">
                        <i class="fas fa-chart-line"></i> 预测下季度趋势
                    </button>
                </div>
            </div>
        `;
    }
    
    // 文档比较响应模板
    function getComparisonResponse() {
        return `
            <div class="document-comparison">
                <p>我已对比分析了<span class="doc-reference" data-doc-id="doc-123">《采购合同2025-XC35》</span>和<span class="doc-reference" data-doc-id="doc-124">《采购合同标准模板》</span>，找出了以下主要差异：</p>
                
                <div class="comparison-graph">
                    <div class="similarity-meter">
                        <div class="similarity-bar" style="width: 68%;">68%</div>
                    </div>
                    <div class="similarity-label">文档相似度</div>
                </div>
                
                <div class="differences-table">
                    <table>
                        <thead>
                            <tr>
                                <th>条款</th>
                                <th>标准模板</th>
                                <th>当前合同</th>
                                <th>差异评估</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="critical-diff">
                                <td>付款条件 (第12条)</td>
                                <td>分3阶段付款，每阶段不超过30%</td>
                                <td>预付70%，剩余交付后支付</td>
                                <td><span class="badge bg-danger">重大差异</span></td>
                            </tr>
                            <tr class="moderate-diff">
                                <td>交付期限 (第8条)</td>
                                <td>签约后45天内交付</td>
                                <td>签约后30天内交付</td>
                                <td><span class="badge bg-warning">中度差异</span></td>
                            </tr>
                            <tr class="minor-diff">
                                <td>知识产权 (第15条)</td>
                                <td>详细列举权益范围和期限</td>
                                <td>笼统描述权益转让</td>
                                <td><span class="badge bg-info">轻微差异</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="summary-box">
                    <h5><i class="fas fa-exclamation-triangle text-warning"></i> 比较总结</h5>
                    <p>该合同与标准模板相比有<strong>3处重大差异</strong>、<strong>2处中度差异</strong>、<strong>4处轻微差异</strong>，总体风险等级为<span class="badge bg-warning">中高</span>，主要风险点集中在付款条件和质量保证条款。</p>
                </div>
                
                <div class="action-buttons">
                    <button class="action-button" onclick="selectAction('生成详细差异报告')">
                        <i class="fas fa-file-alt"></i> 详细差异报告
                    </button>
                    <button class="action-button" onclick="selectAction('修订建议')">
                        <i class="fas fa-edit"></i> 修订建议
                    </button>
                    <button class="action-button" onclick="selectAction('合并最佳条款')">
                        <i class="fas fa-object-group"></i> 合并最佳条款
                    </button>
                </div>
            </div>
        `;
    }
    
    // 风险分析响应模板
    function getRiskResponse() {
        return `
            <div class="risk-analysis">
                <p>我已对<span class="doc-reference" data-doc-id="proj-789">《西部供应链扩展项目》</span>进行了全面风险评估，识别出以下主要风险点：</p>
                
                <div class="risk-matrix">
                    <div class="risk-matrix-header">
                        <div class="corner-label">影响</div>
                        <div class="probability-label">可能性</div>
                    </div>
                    <table class="matrix-table">
                        <tr>
                            <td class="impact-label">高</td>
                            <td class="medium-risk">R5</td>
                            <td class="high-risk">R3</td>
                            <td class="critical-risk">R1</td>
                        </tr>
                        <tr>
                            <td class="impact-label">中</td>
                            <td class="low-risk">R7</td>
                            <td class="medium-risk">R4</td>
                            <td class="high-risk">R2</td>
                        </tr>
                        <tr>
                            <td class="impact-label">低</td>
                            <td class="negligible-risk">R8</td>
                            <td class="low-risk">R6</td>
                            <td class="medium-risk">R9</td>
                        </tr>
                        <tr class="probability-row">
                            <td></td>
                            <td>低</td>
                            <td>中</td>
                            <td>高</td>
                        </tr>
                    </table>
                </div>
                
                <div class="top-risks">
                    <h5>主要风险项</h5>
                    <div class="risk-item critical">
                        <div class="risk-marker">R1</div>
                        <div class="risk-details">
                            <div class="risk-title">项目时间表过于紧凑</div>
                            <div class="risk-description">与类似规模项目相比，当前时间表缩短了20%，存在无法按时交付的高风险</div>
                            <div class="risk-rating">
                                <span class="badge bg-danger">严重风险</span>
                                <span class="probability">高可能性</span>
                                <span class="impact">高影响</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="risk-item high">
                        <div class="risk-marker">R2</div>
                        <div class="risk-details">
                            <div class="risk-title">缺乏明确的变更管理流程</div>
                            <div class="risk-description">项目计划中未定义变更控制流程，可能导致范围蔓延和资源浪费</div>
                            <div class="risk-rating">
                                <span class="badge bg-warning">高风险</span>
                                <span class="probability">高可能性</span>
                                <span class="impact">中影响</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="risk-mitigation">
                    <h5>风险缓解建议</h5>
                    <ol>
                        <li>调整项目时间表，增加15-20%的缓冲时间，特别是在关键路径上的任务</li>
                        <li>制定并实施正式的变更管理流程，包括评估、审批和通知机制</li>
                        <li>完善责任矩阵，确保每个关键领域都有明确的责任人和备份人员</li>
                    </ol>
                </div>
                
                <div class="action-buttons">
                    <button class="action-button" onclick="selectAction('生成详细风险报告')">
                        <i class="fas fa-file-alt"></i> 详细风险报告
                    </button>
                    <button class="action-button" onclick="selectAction('制定风险缓解计划')">
                        <i class="fas fa-shield-alt"></i> 风险缓解计划
                    </button>
                    <button class="action-button" onclick="selectAction('修订项目计划')">
                        <i class="fas fa-calendar-alt"></i> 修订项目计划
                    </button>
                </div>
            </div>
        `;
    }
    
    // 文档摘要响应模板
    function getSummaryResponse() {
        return `
            <div class="document-summary">
                <p>我已为<span class="doc-reference" data-doc-id="doc-123">《采购合同2025-XC35》</span>生成摘要：</p>
                
                <div class="summary-card">
                    <div class="summary-header">
                        <div class="summary-info">
                            <i class="far fa-file-alt"></i>
                            <span>采购合同2025-XC35.docx</span>
                        </div>
                        <div class="summary-meta">
                            <span><i class="far fa-calendar-alt"></i> 2025年3月15日</span>
                            <span><i class="far fa-clock"></i> 估计阅读时间: 15分钟</span>
                        </div>
                    </div>
                    
                    <div class="summary-body">
                        <div class="summary-section">
                            <h5>合同概述</h5>
                            <p>该合同为甲方（买方）与乙方（供应商）之间的采购协议，涉及工业级电子元件的供应，总金额为￥1,250,000元，合同期为1年。</p>
                        </div>
                        
                        <div class="summary-section">
                            <h5>主要条款</h5>
                            <ol>
                                <li><strong>交付时间:</strong> 甲方下单后30天内交付</li>
                                <li><strong>付款条件:</strong> 预付70%，验收后支付剩余30%</li>
                                <li><strong>质量标准:</strong> 符合ISO-9001标准，保证期为12个月</li>
                                <li><strong>违约责任:</strong> 逾期交付按每日0.05%收取违约金，上限为合同金额的5%</li>
                                <li><strong>知识产权:</strong> 与产品相关的知识产权归供应商所有</li>
                            </ol>
                        </div>
                        
                        <div class="summary-section">
                            <h5>关键信息提取</h5>
                            <div class="key-info">
                                <div class="info-row">
                                    <div class="info-label">合同金额</div>
                                    <div class="info-value">￥1,250,000</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">签约日期</div>
                                    <div class="info-value">2025年3月15日</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">交付期限</div>
                                    <div class="info-value">下单后30天内</div>
                                </div>
                                <div class="info-row">
                                    <div class="info-label">合同期限</div>
                                    <div class="info-value">1年（至2026年3月14日）</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-button" onclick="selectAction('完整合同分析')">
                        <i class="fas fa-search-plus"></i> 完整合同分析
                    </button>
                    <button class="action-button" onclick="selectAction('提取关键日期')">
                        <i class="fas fa-calendar-day"></i> 提取关键日期
                    </button>
                    <button class="action-button" onclick="selectAction('提取付款条款')">
                        <i class="fas fa-money-check-alt"></i> 提取付款条款
                    </button>
                </div>
            </div>
        `;
    }
    
    // 通用响应模板
    function getGeneralResponse() {
        const responses = [
            `
            <p>感谢您的问题。我已分析了您提供的文档，发现几个重要观点：</p>
            <ul>
                <li>该项目计划的时间表比行业标准紧凑约20%，可能面临交付风险</li>
                <li>资源分配不均衡，特别是在测试和质量保证阶段</li>
                <li>项目范围定义不够清晰，可能导致后期变更增加</li>
            </ul>
            <p>您希望我对哪一方面进行深入分析？</p>
            `,
            
            `
            <p>我已经对您的问题进行了思考，基于现有文档信息，我有以下建议：</p>
            <ol>
                <li>建立更严格的变更控制流程，防止范围蔓延</li>
                <li>增加关键路径上任务的资源分配，确保按时交付</li>
                <li>引入定期风险评估会议，及早识别和缓解问题</li>
            </ol>
            <p>这些建议中，您最关心哪一方面？我可以提供更具体的实施计划。</p>
            `,
            
            `
            <p>根据我对文档的分析，我注意到以下几个值得关注的趋势：</p>
            <ul>
                <li>第三季度的客户满意度显著提高，与新产品发布时间吻合</li>
                <li>运营成本虽然略有增加，但整体保持在预算范围内</li>
                <li>员工培训投入增加了25%，这可能是绩效改善的关键因素之一</li>
            </ul>
            <p>您想了解更多关于这些趋势背后的原因分析，还是希望获得未来规划建议？</p>
            `
        ];
        
        // 随机选择一个通用响应
        return responses[Math.floor(Math.random() * responses.length)];
    }
});