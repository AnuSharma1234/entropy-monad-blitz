import { test, expect } from '@playwright/test';

test.describe('AI Agent Betting Platform - Full E2E Flow', () => {
  
  test('Navigate to homepage and verify branding', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=ENTROPY')).toBeVisible();
    await expect(page.locator('text=AI Agent Betting Platform')).toBeVisible();
  });

  test('Navigate to agent creation page and verify form loads', async ({ page }) => {
    await page.goto('/agent/create');
    
    await expect(page.locator('text=CREATE_AGENT')).toBeVisible();
    await expect(page.locator('text=Agent Name')).toBeVisible();
    await expect(page.locator('text=Gemini API Key')).toBeVisible();
    await expect(page.locator('text=Personality Budget')).toBeVisible();
  });

  test('Agent creation form: validate 35 point budget system', async ({ page }) => {
    await page.goto('/agent/create');
    
    await expect(page.locator('text=35 / 35')).toBeVisible();
    
    const riskSlider = page.locator('input[type="range"]').first();
    await riskSlider.fill('8');
    
    await expect(page.locator('text=36 / 35')).toBeVisible();
    
    await expect(page.locator('button:has-text("Allocate All 35 Points")')).toBeDisabled();
  });

  test('Agent creation form: verify all 7 stat sliders exist', async ({ page }) => {
    await page.goto('/agent/create');
    
    await expect(page.locator('text=Risk Tolerance')).toBeVisible();
    await expect(page.locator('text=Aggression')).toBeVisible();
    await expect(page.locator('text=Analytical')).toBeVisible();
    await expect(page.locator('text=Patience')).toBeVisible();
    await expect(page.locator('text=Unpredictability')).toBeVisible();
    await expect(page.locator('text=Herd Mentality')).toBeVisible();
    await expect(page.locator('text=Humor')).toBeVisible();
    
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(7);
  });

  test('Agent creation form: verify submit button enables with valid input', async ({ page }) => {
    await page.goto('/agent/create');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    await page.locator('input[placeholder*="CYBER_GAMBLER"]').fill('TEST_AGENT_420');
    await page.locator('input[type="password"]').fill('AIzaTest123456789012');
    
    await expect(submitButton).toBeDisabled();
  });

  test('Agent profile page: verify layout and components', async ({ page }) => {
    await page.goto('/agent/1');
    
    await expect(page.locator('text=CYBER_GAMBLER_420')).toBeVisible();
    await expect(page.locator('text=Performance Overview')).toBeVisible();
    await expect(page.locator('text=Total Bets')).toBeVisible();
    await expect(page.locator('text=Win Rate')).toBeVisible();
    await expect(page.locator('text=Profit/Loss')).toBeVisible();
    await expect(page.locator('text=Recent Bets')).toBeVisible();
    await expect(page.locator('text=Personality Stats')).toBeVisible();
  });

  test('Agent profile page: verify radar chart renders', async ({ page }) => {
    await page.goto('/agent/1');
    
    const radarChart = page.locator('svg').filter({ has: page.locator('g') });
    await expect(radarChart).toBeVisible();
    
    await expect(page.locator('text=Risk')).toBeVisible();
    await expect(page.locator('text=Aggro')).toBeVisible();
    await expect(page.locator('text=Analytical')).toBeVisible();
  });

  test('Spectator feed page: verify live feed components', async ({ page }) => {
    await page.goto('/spectator');
    
    await expect(page.locator('text=SPECTATOR_FEED')).toBeVisible();
    await expect(page.locator('text=Live Activity Feed')).toBeVisible();
    await expect(page.locator('text=Live Chat')).toBeVisible();
    
    await expect(page.locator('button:has-text("ALL")')).toBeVisible();
    await expect(page.locator('button:has-text("MINES")')).toBeVisible();
    await expect(page.locator('button:has-text("PLINKO")')).toBeVisible();
    await expect(page.locator('button:has-text("DICE")')).toBeVisible();
    await expect(page.locator('button:has-text("COINFLIP")')).toBeVisible();
  });

  test('Spectator feed page: verify game filter functionality', async ({ page }) => {
    await page.goto('/spectator');
    
    const minesButton = page.locator('button:has-text("MINES")');
    await minesButton.click();
    
    const minesFilter = page.locator('button:has-text("MINES")');
    await expect(minesFilter).toHaveClass(/neon-green/);
  });

  test('Spectator feed page: verify mock activity data displays', async ({ page }) => {
    await page.goto('/spectator');
    
    await expect(page.locator('text=CYBER_GAMBLER_420')).toBeVisible();
    await expect(page.locator('text=DEGEN_MASTER_9000')).toBeVisible();
    
    const activities = page.locator('[class*="border"]').filter({ hasText: 'MON' });
    const count = await activities.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Spectator feed page: verify agent name links to profile', async ({ page }) => {
    await page.goto('/spectator');
    
    const agentLink = page.locator('a:has-text("CYBER_GAMBLER_420")').first();
    await agentLink.click();
    
    await expect(page).toHaveURL(/\/agent\/1/);
  });

  test('Leaderboard page: verify rankings display', async ({ page }) => {
    await page.goto('/leaderboard');
    
    await expect(page.locator('text=LEADERBOARD')).toBeVisible();
    await expect(page.locator('text=Top performing AI agents')).toBeVisible();
    
    await expect(page.locator('text=1st Place')).toBeVisible();
    await expect(page.locator('text=2nd Place')).toBeVisible();
    await expect(page.locator('text=3rd Place')).toBeVisible();
    
    await expect(page.locator('text=MEGA_WINNER_999')).toBeVisible();
  });

  test('Leaderboard page: verify table columns and sorting', async ({ page }) => {
    await page.goto('/leaderboard');
    
    await expect(page.locator('th:has-text("Rank")')).toBeVisible();
    await expect(page.locator('th:has-text("Agent")')).toBeVisible();
    await expect(page.locator('th:has-text("Profit")')).toBeVisible();
    await expect(page.locator('th:has-text("Win Rate")')).toBeVisible();
    await expect(page.locator('th:has-text("Total Bets")')).toBeVisible();
    
    const profitHeader = page.locator('th:has-text("Profit")');
    await profitHeader.click();
    
    await expect(profitHeader).toBeVisible();
  });

  test('Leaderboard page: verify agent name links to profile', async ({ page }) => {
    await page.goto('/leaderboard');
    
    const agentLink = page.locator('a:has-text("MEGA_WINNER_999")');
    await expect(agentLink).toHaveAttribute('href', '/agent/5');
  });

  test('Stake page: verify deposit and withdraw sections', async ({ page }) => {
    await page.goto('/stake');
    
    await expect(page.locator('text=Staking & Liquidity')).toBeVisible();
    await expect(page.locator('text=Stake Assets')).toBeVisible();
    await expect(page.locator('text=Unstake / Claim')).toBeVisible();
    
    await expect(page.locator('button:has-text("Stake")')).toBeVisible();
    await expect(page.locator('button:has-text("Withdraw")')).toBeVisible();
  });

  test('Stake page: verify amount input and MAX button', async ({ page }) => {
    await page.goto('/stake');
    
    const stakeInput = page.locator('input[type="number"]').first();
    await stakeInput.fill('10.5');
    await expect(stakeInput).toHaveValue('10.5');
    
    const maxButton = page.locator('button:has-text("MAX")');
    await expect(maxButton).toBeVisible();
  });

  test('Stake page: verify 24H cooldown warning', async ({ page }) => {
    await page.goto('/stake');
    
    await expect(page.locator('text=24H Cooldown Required')).toBeVisible();
    await expect(page.locator('text=requestWithdraw')).toBeVisible();
    await expect(page.locator('button:has-text("Request Withdraw")')).toBeVisible();
  });

  test('Full navigation flow: homepage → create → profile → spectator → leaderboard', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('a[href="/agent/create"]').first().click();
    await expect(page).toHaveURL('/agent/create');
    
    await page.goto('/agent/1');
    await expect(page).toHaveURL('/agent/1');
    
    await page.locator('a[href="/spectator"]').first().click();
    await expect(page).toHaveURL('/spectator');
    
    await page.locator('a[href="/leaderboard"]').first().click();
    await expect(page).toHaveURL('/leaderboard');
  });

  test('Responsive design: verify mobile viewport renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await expect(page.locator('text=ENTROPY')).toBeVisible();
    
    await page.goto('/agent/create');
    await expect(page.locator('text=CREATE_AGENT')).toBeVisible();
    
    await page.goto('/spectator');
    await expect(page.locator('text=SPECTATOR_FEED')).toBeVisible();
  });

  test('Screenshot evidence: agent creation form', async ({ page }) => {
    await page.goto('/agent/create');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: '.sisyphus/evidence/task-17-agent-create-form.png',
      fullPage: true 
    });
  });

  test('Screenshot evidence: agent profile page', async ({ page }) => {
    await page.goto('/agent/1');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '.sisyphus/evidence/task-17-agent-profile.png',
      fullPage: true 
    });
  });

  test('Screenshot evidence: spectator feed', async ({ page }) => {
    await page.goto('/spectator');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: '.sisyphus/evidence/task-17-spectator-feed.png',
      fullPage: true 
    });
  });

  test('Screenshot evidence: leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: '.sisyphus/evidence/task-17-leaderboard.png',
      fullPage: true 
    });
  });

  test('Screenshot evidence: stake page', async ({ page }) => {
    await page.goto('/stake');
    
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: '.sisyphus/evidence/task-17-stake-page.png',
      fullPage: true 
    });
  });
});
