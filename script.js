// Wait for the webpage to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the HTML elements
    const hsInput = document.getElementById('hsInput');
    const chorInput = document.getElementById('chorInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');


    // Add a click event listener to the button
    calculateBtn.addEventListener('click', () => {

        // 1. Get and parse inputs
        const hsString = hsInput.value;
        const chor = parseInt(chorInput.value) || 0;

        // Chor must be an integer between 0 and 150
        if (chor < 0 || chor > 150) {
            resultsDiv.innerHTML = "<p style='color: red; text-align: center;'>Chor'gorloth can only be between 0 and 150.</p>";
            return;
        }
        // Parse the input
        const hsParts = hsString.split('e').map(part => parseFloat(part.trim()));
        if (hsParts.length !== 2 || hsParts.some(isNaN)) {
            //if input is a number but not in scientific notation, parse
            if (!isNaN(parseFloat(hsString))) {
                hsParts[0] = parseFloat(hsString);
                hsParts[1] = 0;}
            else{
                resultsDiv.innerHTML = "<p style='color: red; text-align: center;'>Invalid HS input. Please use scientific format.<br>Use at least 1e3 HS.</p>";
                return;}
        }
        const [mantissa, exponent] = hsParts;
        const initialLogHS = Math.log10(mantissa) + exponent;

        // Minimum 1000 HS so 3 logHS check
        if (initialLogHS < 3) {
            resultsDiv.innerHTML = "<p style='color: red; text-align: center;'>Enter at least 1e3 HS.<br>Pre-transcending (zone 300), follow<br>the pretrans ancient guide</p>";
            return;
        }

        // Calculate the effective logHS per ancient (chorgorloth and dividing into 9 parts)
        const effectiveLogHS = initialLogHS - (chor * Math.log10(0.95)) - Math.log10(9);

        // 3. Final ancient levels in log
        const log_r1 = effectiveLogHS / 2 + Math.log10(Math.sqrt(2));
        const log_r2 = effectiveLogHS / 2.5 + Math.log10(Math.pow(2.5, 0.4));
        const log_r3 = log_r1 - 2;
        const log_r4 = log_r2 - 1.5;

        // 4. Convert log values back to "mantissa e exponent" notation
        const results = [log_r1, log_r2, log_r3, log_r4].map(formatToScientificNotation);

        // 5. Display the results
        resultsDiv.innerHTML = `
            <div>
                <label>Argaiv, Bhaal, Frags, Mammon, Mimzee, Pluto:</label>
                <input type="text" value="${results[0]}" readonly />
            </div>
            <div>
                <label>Juggernaut:</label>
                <input type="text" value="${results[1]}" readonly />
            </div>
            <div>
                <label>Libertas, Siyalatas:</label>
                <input type="text" value="${results[2]}" readonly />
            </div>
            <div>
                <label>Nogardnit:</label>
                <input type="text" value="${results[3]}" readonly />
            </div>
            <div>
                <label>All remaining HS into Morgulis, should be lvl:</label>
                <input type="text" value="${formatToScientificNotation(effectiveLogHS+Math.log10(2))}" readonly />
            </div>
        `;
    });

    /**
     * Helper function to convert a log10 value back into "mantissa e exponent" notation.
     * Example: 50.301 -> "2.0e50"
     */
    function formatToScientificNotation(logValue) {
        if (logValue < 0) {
            return "0"; }
        if (logValue < 4) {
            // For small values, return as rounded integer
            return Math.round(Math.pow(10, logValue)).toString();
        }
        const exponent = Math.floor(logValue);
        const mantissa = Math.pow(10, logValue - exponent);
        return `${mantissa.toFixed(6)}e${exponent}`;
    }
});
