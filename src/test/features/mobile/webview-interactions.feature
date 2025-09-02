@mobile @webview
Feature: WebView Interactions
  As a mobile app tester
  I want to interact with WebViews in the app
  So that I can test features that use web content

  Background:
    Given I open the app
    And I wait for the app to be ready

  @webview-basic
  Scenario: Switch between native and WebView contexts
    When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    Then WebView context should exist
    When I switch to WebView context
    # Perform WebView interactions
    And I switch to Native app context
    # Continue with native app interactions

  @webview-navigation
  Scenario: Navigate to a URL in WebView
    When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    And I navigate to "https://example.com" in WebView
    Then element "h1" in WebView should contain text "Example Domain"
    When I switch to Native app context
    # Continue with native app interactions

  @webview-interaction
  Scenario: Interact with elements in WebView
    When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    And I navigate to "https://example.com" in WebView
    And I click on element "a" in WebView
    # Verify the click action result
    When I switch to WebView context
    And I set text "search query" to element "#search-input" in WebView
    And I click on element "#search-button" in WebView
    # Verify search results
    When I switch to Native app context
    # Continue with native app interactions

  @webview-js
  Scenario: Execute JavaScript in WebView
    When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    And I execute JavaScript "return document.title;" in WebView
    # Result will be stored in test data with key 'javascriptResult'
    And I execute JavaScript "document.querySelector('h1').textContent = 'Modified by Test';" in WebView
    Then element "h1" in WebView should contain text "Modified by Test"
    When I switch to Native app context
    # Continue with native app interactions
