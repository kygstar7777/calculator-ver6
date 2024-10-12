document.getElementById("calculateButton").addEventListener("click", function() {
    // 입력값 가져오기
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000; // 만원 단위
    const dividendRate = parseFloat(document.getElementById("dividendRate").value) / 100;
    const dividendGrowthRate = parseFloat(document.getElementById("dividendGrowthRate").value) / 100;
    const stockGrowthRate = parseFloat(document.getElementById("stockGrowthRate").value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000; // 만원 단위
    const monthlyInvestmentGrowthRate = parseFloat(document.getElementById("monthlyInvestmentGrowthRate").value) / 100;
    const reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const targetMonthlyDividend = parseFloat(document.getElementById("targetMonthlyDividend").value) * 10000; // 만원 단위

    // 결과 변수 초기화
    let results = [];
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let accumulatedDividends = 0; // 누적 배당금 초기화

    for (let year = 1; year <= 30; year++) {
        // 첫해 월 투자금
        const currentMonthlyInvestment = year === 1 ? monthlyInvestment : monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        
        // 연 투자금
        const annualInvestment = totalInvestment + currentMonthlyInvestment * 12;

        // 첫해 배당금 계산
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);
        
        // 배당금 성장률 적용
        const adjustedDividend = annualDividend * Math.pow(1 + dividendGrowthRate, year - 1); // 배당금 성장률 적용
        
        // 총 자산
        const totalAssets = (annualInvestment + adjustedDividend) * (1 + stockGrowthRate);

        // 결과 저장
        results.push({
            year: year,
            annualDividend: adjustedDividend,
            monthlyDividend: adjustedDividend / 12,
            totalAssets: totalAssets,
            totalInvestment: totalInvestment + currentMonthlyInvestment * 12,
            totalDividends: accumulatedDividends + adjustedDividend
        });

        // 총 투자금과 배당금 업데이트
        totalInvestment += currentMonthlyInvestment * 12;
        accumulatedDividends += adjustedDividend;
    }

    // 결과 출력
    let resultHTML = "<h2>계산 결과 | Calculation Results</h2>";
    resultHTML += "<table border='1'><tr><th>연도 | Year</th><th>연 배당금 | Annual Dividend (만원)</th><th>월 배당금 | Monthly Dividend (만원)</th><th>총 자산 | Total Assets (만원)</th><th>누적 투자 원금 | Cumulative Investment (만원)</th><th>누적 투자 배당금 | Cumulative Dividend (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${(result.annualDividend / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td>${(result.monthlyDividend / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td>${(result.totalAssets / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td>${(result.totalInvestment / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td>${(result.totalDividends / 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
        </tr>`;
    });
    resultHTML += "</table>";
    document.getElementById("results").innerHTML = resultHTML;

    // 차트 데이터 준비
    const labels = results.map(result => result.year);
    const data = results.map(result => result.monthlyDividend / 10000); // 만원 단위로 변환

    // 차트 그리기
    const ctx = document.getElementById("dividendChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "월 배당금 | Monthly Dividend (만원)",
                data: data,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "만원"
                    }
                }
            }
        }
    });
});

// 언어 전환 기능
const langSwitchButton = document.getElementById("langSwitch");
let currentLang = "ko";

langSwitchButton.addEventListener("click", function() {
    if (currentLang === "ko") {
        switchToEnglish();
        currentLang = "en";
        langSwitchButton.textContent = "한국어로 전환"; // Update button text
    } else {
        switchToKorean();
        currentLang = "ko";
        langSwitchButton.textContent = "영어로 전환"; // Update button text
    }
});

function switchToEnglish() {
    document.getElementById("title").textContent = "Dividend Calculator";
    document.getElementById("initialInvestmentLabel").textContent = "Initial Investment (10,000 KRW):";
    document.getElementById("dividendRateLabel").textContent = "Dividend Rate (%):";
    document.getElementById("dividendGrowthRateLabel").textContent = "Dividend Growth Rate (%):";
    document.getElementById("stockGrowthRateLabel").textContent = "Stock Growth Rate (%):";
    document.getElementById("monthlyInvestmentLabel").textContent = "Monthly Investment (10,000 KRW):";
    document.getElementById("monthlyInvestmentGrowthRateLabel").textContent = "Monthly Investment Growth Rate (%):";
    document.getElementById("reinvestmentRateLabel").textContent = "Reinvestment Rate (%):";
    document.getElementById("taxRateLabel").textContent = "Tax Rate (%):";
    document.getElementById("inflationRateLabel").textContent = "Inflation Rate (%):";
    document.getElementById("targetMonthlyDividendLabel").textContent = "Target Monthly Dividend (10,000 KRW):";
    document.getElementById("calculateButton").textContent = "Calculate";
}

function switchToKorean() {
    document.getElementById("title").textContent = "배당금 계산기";
    document.getElementById("initialInvestmentLabel").textContent = "초기 투자금 (만원):";
    document.getElementById("dividendRateLabel").textContent = "배당률 (%):";
    document.getElementById("dividendGrowthRateLabel").textContent = "배당 성장률 (%):";
    document.getElementById("stockGrowthRateLabel").textContent = "주가 상승률 (%):";
    document.getElementById("monthlyInvestmentLabel").textContent = "월 투자금 (만원):";
    document.getElementById("monthlyInvestmentGrowthRateLabel").textContent = "월 투자금 증가율 (%):";
    document.getElementById("reinvestmentRateLabel").textContent = "배당금 재투자율 (%):";
    document.getElementById("taxRateLabel").textContent = "세율 (%):";
    document.getElementById("inflationRateLabel").textContent = "인플레이션 (%):";
    document.getElementById("targetMonthlyDividendLabel").textContent = "목표 월 배당금 (만원):";
    document.getElementById("calculateButton").textContent = "계산하기";
}
