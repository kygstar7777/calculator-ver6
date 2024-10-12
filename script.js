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
    let totalInvestment = initialInvestment;
    let totalDividends = 0;
    let accumulatedDividends = 0;

    for (let year = 1; year <= 30; year++) {
        const currentMonthlyInvestment = year === 1 ? monthlyInvestment : monthlyInvestment * Math.pow(1 + monthlyInvestmentGrowthRate, year - 1);
        const annualInvestment = totalInvestment + currentMonthlyInvestment * 12 + annualDividend;
        const annualDividend = (annualInvestment * dividendRate) * reinvestmentRate * (1 - taxRate) * (1 - inflationRate);
        const adjustedDividend = annualDividend * Math.pow(1 + dividendGrowthRate, year - 1);

        const totalAssets = (annualInvestment + adjustedDividend) * (1 + stockGrowthRate);

        results.push({
            year: year,
            annualDividend: adjustedDividend,
            monthlyDividend: adjustedDividend / 12,
            totalAssets: totalAssets,
            totalInvestment: totalInvestment + currentMonthlyInvestment * 12,
            totalDividends: accumulatedDividends + adjustedDividend
        });

        totalInvestment += currentMonthlyInvestment * 12;
        accumulatedDividends += adjustedDividend;
    }

    const yearsToTarget = results.findIndex(result => result.monthlyDividend >= targetMonthlyDividend) + 1;

    // 결과를 초기화
    let resultHTML = "<h2>계산 결과</h2>";

    // 목표 월 배당금에 도달하지 못할 경우를 처리
    if (yearsToTarget === 0) {
        resultHTML += `<div class="motivation">목표를 달성하기 위해서는 총 ${results.length}년 이상이 걸립니다.<br>경제적 자유를 위해 화이팅하세요!</div>`;
    } else {
        results = results.slice(0, yearsToTarget); // 결과를 목표 달성 연도까지만 저장
        resultHTML += `<div class="motivation">목표를 달성하기 위해서는 총 ${yearsToTarget}년이 걸립니다.<br>경제적 자유를 위해 화이팅하세요!</div>`;
    }

    resultHTML += "<table border='1'><tr><th>연도</th><th>연 배당금 (만원)</th><th>월 배당금 (만원)</th><th>총 자산 (만원)</th><th>누적 투자 원금 (만원)</th><th>누적 투자 배당금 (만원)</th></tr>";
    results.forEach(result => {
        resultHTML += `<tr>
            <td>${result.year}</td>
            <td>${formatNumber(Math.round(result.annualDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.monthlyDividend / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalAssets / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalInvestment / 10000))}</td>
            <td>${formatNumber(Math.round(result.totalDividends / 10000))}</td>
        </tr>`;
    });
    resultHTML += "</table>";

    document.getElementById("results").innerHTML = resultHTML;
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
