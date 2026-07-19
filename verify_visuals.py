import os
from playwright.sync_api import sync_playwright

def main():
    os.makedirs('/home/jules/verification', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set a standard desktop viewport size
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Navigate to the local server
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(2000)

        # Capture Dashboard
        page.screenshot(path="/home/jules/verification/dashboard.png")
        print("Captured Dashboard.")

        # Find all nav buttons
        buttons = page.locator("nav button").all()
        print(f"Found {len(buttons)} navigation buttons.")

        tab_names = ["dashboard", "bio-chat", "vision-lab", "notebook", "settings"]

        for idx, btn in enumerate(buttons):
            if idx == 0:
                continue # Already captured dashboard

            try:
                btn.click()
                page.wait_for_timeout(1000)
                path = f"/home/jules/verification/{tab_names[idx]}.png"
                page.screenshot(path=path)
                print(f"Captured {tab_names[idx]} to {path}")
            except Exception as e:
                print(f"Could not click button at index {idx}: {e}")

        browser.close()

if __name__ == "__main__":
    main()
