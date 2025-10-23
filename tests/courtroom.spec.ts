import { test, expect, Page } from '@playwright/test';

// These 2 Playwright tests were created with assistance from Claude.ai

const BASE_URL = 'http://localhost:3003';
const COURT_ROOM_URL = `${BASE_URL}/court-room`;

// Increase test timeout to 120 seconds for the penalty test
test.setTimeout(120000);

test.describe('Court Room Game Logic and Output Validation', () => {

    /**
     * Helper function to start the game in Easy mode (120 seconds)
     */
    const startGame = async (page: Page) => {
        await page.goto(COURT_ROOM_URL);
        await expect(page.getByText('Court Room Challenge')).toBeVisible();

        // Select Easy mode (120 seconds)
        await page.getByRole('button', { name: /2 mins/i }).click();
        
        // Start the game
        await page.getByRole('button', { name: 'Start Game' }).click();
        await expect(page.getByRole('heading', { name: 'Court Room Challenge - Debugging' })).toBeVisible();
    };

    /**
     * Test Case 1: Successful Fix and Submission (Easy Mode)
     * This test verifies that when I fix the input validation issue correctly,
     * the game recognizes the fix and shows the success screen.
     */
    test('Successful game completion: Fixes Laws of Tort and submits', async ({ page }) => {
        await startGame(page);
        
        // Locate the code editor textarea
        const codeEditor = page.locator('textarea').first();
        await expect(codeEditor).toBeVisible({ timeout: 10000 });

        // Get the initial buggy code
        const initialCode = await codeEditor.inputValue();
        console.log('Initial code length:', initialCode.length);

        // Apply the fix for Laws of Tort validation
        const fixedCode = initialCode.replace(
            "console.log('Saving profile...');",
            `const emailInput = document.getElementById('email').value;
    // Fix for Laws of Tort: Input Validation
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
        alert('Invalid email! Must include @ and .');
        return; 
    }
    console.log('Saving profile...');`
        );

        console.log('Fixed code - validation added');

        // Replace the code in the editor
        await codeEditor.click();
        await codeEditor.fill(fixedCode);

        // Wait for the code to be processed
        await page.waitForTimeout(2000);

        // Submit the fixed code
        await page.getByRole('button', { name: 'SUBMIT' }).click();

        // Verify that the success popup appears
        await expect(page.getByRole('heading', { name: 'Case Closed!' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Congratulations/i)).toBeVisible();
        
        // Check that the success message shows issues were resolved
        const successText = page.getByText(/Issues resolved/i);
        await expect(successText).toBeVisible();
        
        console.log('Test 1 PASSED: Game completed successfully!');
    });


    /**
     * Test Case 2: Game Failure and Penalty Issuance (Easy Mode)
     * This test verifies that if I ignore the critical fix for 90 seconds,
     * the game triggers the penalty screen as expected.
     * 
     * Easy Mode Timing:
     * - Initial message: 30 seconds (25% of 120s)
     * - Urgent message: 60 seconds (50% of 120s)  
     * - Penalty triggers: 90 seconds (75% of 120s)
     */
    test('Game failure: Ignores Laws of Tort fix and triggers Penalty Screen', async ({ page }) => {
        await startGame(page);
                
        // The penalty should appear at 90 seconds elapsed time
        console.log('Waiting 95 seconds for penalty to trigger at 90 seconds elapsed...');
        console.log('Start time:', new Date().toLocaleTimeString());
        
        await page.waitForTimeout(95000);
        
        console.log('End time:', new Date().toLocaleTimeString());

        // Verify the penalty overlay appears with the correct heading
        const penaltyTitle = page.getByRole('heading', { name: 'COURT ORDER' });
        await expect(penaltyTitle).toBeVisible({ timeout: 5000 });

        // Verify the penalty subtitle is displayed
        await expect(page.getByRole('heading', { name: 'PENALTY ISSUED' })).toBeVisible();

        // Verify the specific penalty message for breaking Laws of Tort
        const penaltyMessage = page.getByText('You are fined for breaking the Laws of Tort.');
        await expect(penaltyMessage).toBeVisible();

        // Verify the acknowledge button is present
        await expect(page.getByRole('button', { name: 'ACKNOWLEDGE PENALTY' })).toBeVisible();
        
        console.log('Test 2 PASSED: Penalty screen appeared correctly!');
        
        // Click acknowledge to dismiss the penalty
        await page.getByRole('button', { name: 'ACKNOWLEDGE PENALTY' }).click();
        
        // Verify the game resets to the welcome screen
        await expect(page.getByText('Court Room Challenge')).toBeVisible({ timeout: 3000 });
    });

});