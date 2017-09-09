# Edge Script

This is a stab at defining a rule system for capturing edge cases and assigning events to next actions based on those rules. This is designed with human systems in mind, where edge cases make up a good percent of the functionality. It aims to be definable in such a way that annlysis of these rules is clearly possible, garenteing that no two rules over lap and that all rules fall within the contraints of the greater system.

Long term this project should also have a visualizer that takes edge scripts and helps one explore the relationships between the provided rules and understand how many events match each rule or action.


## Words

### Rule

A rule is a set of limits and a single action. All edge scripts must have a `fallback` rule. All rules must have a unique name and a unique set of limits. When being evaulated, the fallback rule is evaulated last.

### Action

An action a next system name that should be taken when the related rule's limits match an event. Many rules can share the same action.

### Limit

A limit is a range of numbers, strings or booleans that define how an event is matched to this rule. All limits for non-fallback rules must bewithin the constraints of the fallback rule and must not overlap with other rules. Names for limits must match the attribute name of the event.

### Event

An event is an object to be evaulated againts the rules. Its attributes are used to find which rule matches it. If no rule matches the event an error is thrown noting that this event fall out of bounds.
