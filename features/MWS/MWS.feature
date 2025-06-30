@MWS
Feature: MWS - Main Page

  Scenario Outline: MWS screenshot "<URL>" UI comparison
    Given a customer is browsing NS&I marketing website
    When the User navigated to the "<URL>" MWS page
    Then the "MWS" page is displayed properly

    Examples:
      | URL                     |
      | /products/premium-bonds |
      | /isa                    |
