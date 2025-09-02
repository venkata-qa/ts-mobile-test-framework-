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
    # Skip navigation step if WebView is loaded automatically
    # When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    Then WebView context should exist
    When I switch to WebView context
    # Perform WebView interactions
    And I switch to Native app context
    # Continue with native app interactions

  @webview-content
  Scenario: Verify WebView content is loaded automatically
    # Skip navigation step if WebView is loaded automatically
    # When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    # No need to navigate to URL since WebView content is already loaded
    Then element "h1" in WebView should contain text "Expected Heading"
    When I switch to Native app context
    # Continue with native app interactions

  @webview-interaction
  Scenario: Interact with elements in WebView
    # Skip navigation step if WebView is loaded automatically
    # When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    # Content is already loaded in WebView, no navigation needed
    
    # Using the new page object pattern
    And I tap on the "mainLink" element in the "WebViewPage" WebView page
    And I type "search query" into the "searchInput" field in the "WebViewPage" WebView page
    And I tap on the "searchButton" element in the "WebViewPage" WebView page
    Then the "searchResults" element in the "WebViewPage" WebView page should contain text "Results"
    
    # Legacy approach with direct selectors (still supported)
    And I click on element "a" in WebView
    And I set text "search query" to element "#search-input" in WebView
    And I click on element "#search-button" in WebView
    
    When I switch to Native app context
    # Continue with native app interactions

  @webview-js
  Scenario: Execute JavaScript in WebView
    # Skip navigation step if WebView is loaded automatically
    # When I navigate to the WebView screen
    And I wait for WebView context 10000 ms
    And I switch to WebView context
    And I execute JavaScript "return document.title;" in WebView
    # Result will be stored in test data with key 'javascriptResult'
    And I execute JavaScript "document.querySelector('h1').textContent = 'Modified by Test';" in WebView
    Then element "h1" in WebView should contain text "Modified by Test"
    When I switch to Native app context
    # Continue with native app interactions
