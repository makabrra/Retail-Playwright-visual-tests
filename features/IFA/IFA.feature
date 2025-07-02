@IFA @All
Feature: IFA

  Scenario Outline: IFA screenshot "<URL>" UI comparison
    Given a User is browsing NS&I adviser website
    And the User close popup and continue to Adviser Centre
    When the User navigated to the "<URL>" IFA page
    Then the "IFA" page is displayed properly

    Examples:
      | URL         |
      | /why-nsandi |

