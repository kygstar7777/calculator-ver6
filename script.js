document.getElementById("calculateButton").addEventListener("click", function() {
    const initialInvestment = parseFloat(document.getElementById("initialInvestment").value) * 10000;
    const dividendRate = parseFloat(document.getElementById("dividendRate").value) / 100;
    const dividendGrowthRate = parseFloat(document.getElementById("dividendGrowthRate").value) / 100;
    const stockGrowthRate = parseFloat(document.getElementById("stockGrowthRate").value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById("monthlyInvestment").value) * 10000;
    const monthlyInvestmentGrowthRate = parseFloat(document.getElementById("monthlyInvestmentGrowthRate").value) / 100;
    const reinvestmentRate = parseFloat(document.getElementById("reinvestmentRate").value) / 100;
    const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;
    const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
    const targetMonthlyDividend = parseFloat(document.getElementById("targetMonthlyDividend").value) * 10000;

    let results = [];
    let totalInvestment = initialInvestment; // 초기 투자금 (첫해 연 투자금)
    let accumulatedDividends = 0;
    let totalAssets = initialInvestment; // 초기 자산은 초기 투자금

    for (let year = 1; year <= 100; year++) {
        // 월 투자금 계산
        let currentMonthlyInvestment = monthlyInvestment;
        if (year > 1) {
            currentMonthlyInvestment *= Math.pow(1 + monthlyInvestmentGrowthRate, year - 1); // 월 투자금 증가율 반영
        }

        // 연 투자금 계산
        let annualInvestment = totalInvestment + currentMonthlyInvestment * 12;
        if (year > 1) {
            annualInvestment += accumulatedDividends; // 이전 연도의 배당금 포함
        }

        // 연 배당금 계산
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);
        
        // 총 자산 계산
        totalAssets = (totalAssets + annualDividend) * (1 + stockGrowthRate);

        // 배당 성장률 반영 (첫 해 제외)
        const adjustedDividend = annualDividend * Math.pow(1 + dividendGrowthRate, year - 1);
        
        // 결과 저장
        results.push({
            year: year,
            annualDividend: adjustedDividend,
            monthlyDividend: adjustedDividend / 12,
            totalAssets: totalAssets,
            totalInvestment: totalInvestment + currentMonthlyInvestment * 12,
            accumulatedDividends: accumulatedDividends + adjustedDividend // 누적 배당금
        });

        // 투자금 업데이트
        totalInvestment += currentMonthlyInvestment * 12;
        accumulatedDividends += adjustedDividend; // 배당금 누적
    }

    // 목표 월 배당금 달성 연도 계산
    const yearsToTarget = results.findIndex(result => result.monthlyDividend >= targetMonthlyDividend) + 1;

    // 결과 HTML 초기화
    let resultHTML = "<h2>계산 결과</h2>";

    // 목표 월 배당금에 도달하지 못할 경우 처리
    if (yearsToTarget === 0) {
        resultHTML += `<div class="motivation">목표를 달성하기 위해서는 총 ${results.length}년 이상이 걸립니다.<br>경제적 자유를 위해 화이팅하세요!</div>`;
    } else {
        results = results.slice(0, yearsToTarget); // 결과를 목표 달성 연도까지만 저장
        resultHTML += `<div class="motivation">목표를 달성하기 위해서는 총 ${yearsToTarget}년이 걸립니다.<br>경제적 자유를 위해 화이팅하세요!</div>`;
    }

    // 결과 표 생성
    resultHTML += "<table border='1'><tr><th>연도</th><th>연 배당금 (만원)</th><th>월 배당금 (만원)</th><th>총 자산 (만원)</th><th>누적 투자 원금 (만원)</th><th>누적 투자 배당금 (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${formatNumber(Math.round(result.annualDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.monthlyDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalAssets / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalInvestment / 10000))}</td>
            <td>${formatNumber(Math.round(result.accumulatedDividends / 10000))}</td>
        </tr>`;
    });
    resultHTML += "</table>";

    // 결과 출력
    document.getElementById("results").innerHTML = resultHTML;
});

// 숫자 포맷 함수
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
