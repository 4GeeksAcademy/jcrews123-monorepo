# What Brasaland Telemetry Means

This work gives Brasaland a reliable record of what happens inside the internal inventory system. It does not track visitors to the public website.

## Project 45 — Agreeing on what matters

The first project defines the questions Brasaland wants to answer and the exact shape of the information recorded. It is like agreeing on the labels and rules for a filing system before filling the cabinets. Staff and customers see no website change.

## Project 46 — Capturing operational signals

The backoffice quietly records small operational signals after real outcomes: a delivery was saved, waste was registered, a login failed, or a page loaded slowly. Signals are grouped and sent together so they do not slow down normal work.

Inventory receives a few necessary fields: minimum stock, supplier unit cost, currency, and a specific waste reason. Stock still cannot be edited directly; every real change remains traceable through an inbound or outbound order.

## Project 47 — Saving the history

The API checks each signal and stores valid events in Supabase. One bad event does not discard the rest of a batch. Stored events are permanent facts: the application does not edit or delete them.

## Project 48 — Showing system health

Nicolás's technology team receives a technical report and internal page showing:

- how many events the system processes;
- where browser or API failures occur;
- how long API requests take;
- how often logins fail.

This is not Mariana's revenue dashboard and does not calculate sales, conversion, or profit. Those business reports belong to later data-pipeline work.

## Privacy

Telemetry never records passwords, email addresses, employee names, customer data, form values, request bodies, or raw error stacks. User identifiers are internal pseudonymous IDs used only to understand authenticated system activity. Routes exclude query strings.

## Who benefits

- **Felipe** can later understand shortages and waste patterns.
- **Lucía** can identify supplier price changes.
- **Jake** can see where traceability training may be needed.
- **Nicolás** can monitor reliability, latency, and authentication problems.
- **Mariana** can eventually receive aggregated reports built by later pipeline projects.
