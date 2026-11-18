import { useMemo, useState } from "react";

type Screen = "dashboard" | "detail" | "review";
type ReviewState = "review" | "confirm" | "done";

type Suggestion = {
  day: number;
  label: string;
  suggested: number;
  reason: string;
  evidence: "Measured" | "Estimated";
};

const suggestions: Suggestion[] = [
  {
    day: 8,
    label: "Tue, 8 Dec",
    suggested: 5200,
    reason: "Calendar gap between bookings",
    evidence: "Measured",
  },
  {
    day: 9,
    label: "Wed, 9 Dec",
    suggested: 5200,
    reason: "Calendar gap between bookings",
    evidence: "Measured",
  },
  {
    day: 10,
    label: "Thu, 10 Dec",
    suggested: 5200,
    reason: "Calendar gap between bookings",
    evidence: "Measured",
  },
  {
    day: 20,
    label: "Sun, 20 Dec",
    suggested: 7200,
    reason: "Holiday-week demand",
    evidence: "Measured",
  },
  {
    day: 21,
    label: "Mon, 21 Dec",
    suggested: 7200,
    reason: "Holiday-week demand",
    evidence: "Measured",
  },
  {
    day: 22,
    label: "Tue, 22 Dec",
    suggested: 7200,
    reason: "Holiday-week demand",
    evidence: "Measured",
  },
  {
    day: 23,
    label: "Wed, 23 Dec",
    suggested: 7200,
    reason: "Holiday-week demand",
    evidence: "Measured",
  },
  {
    day: 27,
    label: "Sun, 27 Dec",
    suggested: 8400,
    reason: "Music festival nearby",
    evidence: "Estimated",
  },
  {
    day: 28,
    label: "Mon, 28 Dec",
    suggested: 8400,
    reason: "Music festival nearby",
    evidence: "Estimated",
  },
  {
    day: 29,
    label: "Tue, 29 Dec",
    suggested: 8400,
    reason: "Music festival nearby",
    evidence: "Estimated",
  },
  {
    day: 30,
    label: "Wed, 30 Dec",
    suggested: 8400,
    reason: "Music festival nearby",
    evidence: "Estimated",
  },
  {
    day: 31,
    label: "Thu, 31 Dec",
    suggested: 14500,
    reason: "New Year's Eve peak",
    evidence: "Estimated",
  },
];

const bookedDays = new Set([4, 5, 6, 11, 12, 13, 15, 16, 18, 19, 24, 25, 26]);
const weekendDays = new Set([4, 5, 11, 12, 18, 19, 25, 26]);
const eventDays = new Set([27, 28, 29, 30, 31]);
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const signedMoney = (value: number) => `${value >= 0 ? "+" : "−"}${money(Math.abs(value))}`;
const currentPrice = (day: number) => (weekendDays.has(day) ? 7500 : 6000);

function Icon({
  name,
  size = 18,
}: {
  name: "arrow-up" | "arrow-down" | "trend" | "flag" | "users" | "check" | "warning" | "chevron";
  size?: number;
}) {
  const paths = {
    "arrow-up": (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),
    "arrow-down": (
      <>
        <path d="M12 5v14" />
        <path d="m18 13-6 6-6-6" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    flag: (
      <>
        <path d="M5 21V4" />
        <path d="M5 5h11l-2 4 2 4H5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3.2 2.7-5 6-5s6 1.8 6 5" />
        <path d="M16 5.5a3 3 0 0 1 0 5.5M17 14c2.4.5 4 2.1 4 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    warning: (
      <>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Header({ goHome }: { goHome: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={goHome}>
          HostLens
        </button>
        <div className="listing-control">
          <span>Listing</span>
          <button>
            Sea-view 2BHK · Assagao, Goa <span aria-hidden="true">⌄</span>
          </button>
        </div>
        <nav aria-label="Primary">
          <button className="nav-active" onClick={goHome}>
            Pricing
          </button>
          <button>Reservations</button>
          <button>Listing</button>
        </nav>
        <button className="avatar" aria-label="Open account menu">
          A
        </button>
      </div>
    </header>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  tone = "measured",
}: {
  children: React.ReactNode;
  tone?: "measured" | "estimated" | "event" | "neutral" | "rust";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Change({ value, percent }: { value: number; percent?: number }) {
  const up = value >= 0;
  return (
    <span className={`change ${up ? "increase" : "decrease"}`}>
      <Icon name={up ? "arrow-up" : "arrow-down"} size={14} />
      {signedMoney(value)}
      {percent !== undefined && ` · ${up ? "+" : "−"}${Math.abs(percent)}%`}
    </span>
  );
}

function Dashboard({
  setScreen,
  prices,
}: {
  setScreen: (screen: Screen) => void;
  prices: Record<number, number>;
}) {
  const metricData = [
    ["Occupancy", "42%", "13 of 31 December nights booked", "down", "Similar listings: 61%"],
    [
      "Average daily rate (ADR)",
      "₹6,920",
      "Average price of the nights you've sold",
      "down",
      "Similar listings: ₹7,400",
    ],
    [
      "Total Revenue - December",
      "₹90,000",
      "Confirmed bookings only\n(Subject to change)",
      "up",
      "+₹20,500 possible at suggested prices",
    ],
    [
      "RevPAR",
      "₹2,900",
      "Revenue ÷ all 31 nights. Combines price and occupancy",
      "down",
      "Similar listings: ₹4,510",
    ],
    [
      "Booking pace",
      "3 / week",
      "New December bookings in the last 7 days",
      "down",
      "Similar listings: 5 / week",
    ],
  ];
  return (
    <>
      <Header goHome={() => setScreen("dashboard")} />
      <main className="page">
        <div className="page-title-row">
          <div>
            <h1>December 2026</h1>
            <p>Pricing &amp; performance · as of Wed, 18 Nov 2026 · prices in ₹ per night</p>
          </div>
          <div className="title-actions">
            <Button variant="secondary">Pricing rules</Button>
            <Button onClick={() => setScreen("review")}>Review 12 suggestions</Button>
          </div>
        </div>

        <section className="opportunity-banner">
          <div className="opportunity-icon">
            <Icon name="trend" size={24} />
          </div>
          <div className="opportunity-copy">
            <span className="eyebrow">TOP OPPORTUNITY</span>
            <h2>Festival week, 27–31 Dec, is priced below similar listings</h2>
            <p>
              5 open nights during a local music festival and New Year's Eve. Event impact is
              estimated, not measured.
            </p>
          </div>
          <div className="opportunity-value">
            <strong>+₹18,100</strong>
            <span>if all 5 nights book at suggested prices</span>
          </div>
          <Button variant="outline" onClick={() => setScreen("detail")}>
            See why <Icon name="chevron" size={16} />
          </Button>
        </section>

        <section className="metrics-grid">
          {metricData.map(([label, value, definition, direction, compare]) => (
            <article className="panel metric-card" key={label}>
              <span className="metric-label">{label}</span>
              <strong>{value}</strong>
              <p>{definition}</p>
              <div className={`metric-compare ${direction === "up" ? "increase" : "decrease"}`}>
                <Icon name={direction === "up" ? "arrow-up" : "arrow-down"} size={14} />
                {compare}
              </div>
            </article>
          ))}
        </section>

        <div className="calendar-layout">
          <Calendar openDetail={() => setScreen("detail")} prices={prices} />
          <MoreOpportunities
            openDetail={() => setScreen("detail")}
            openReview={() => setScreen("review")}
          />
        </div>
        <div className="insights-grid">
          <MarketIntelligence />
          <ListingComparison />
        </div>
        <ComparableTable />
      </main>
    </>
  );
}

function Calendar({
  openDetail,
  prices,
}: {
  openDetail: () => void;
  prices: Record<number, number>;
}) {
  const cells = Array.from({ length: 35 }, (_, index) => index - 1);
  return (
    <section className="panel calendar-panel">
      <div className="section-title">
        <h2>Pricing calendar</h2>
        <div className="calendar-arrows">
          <button aria-label="Previous month">‹</button>
          <button aria-label="Next month">›</button>
        </div>
      </div>
      <div className="legend">
        <span>
          <i className="legend-available" />
          Available
        </span>
        <span>
          <i className="legend-booked" />
          Booked
        </span>
        <span className="increase">
          <Icon name="arrow-up" size={13} />
          Raise suggested
        </span>
        <span className="decrease">
          <Icon name="arrow-down" size={13} />
          Lower suggested
        </span>
        <span className="event-text">
          <Icon name="flag" size={13} />
          Local event
        </span>
      </div>
      <div className="calendar-grid weekday-row">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day, index) => {
          if (day < 1 || day > 31) return <div className="day-cell empty" key={`empty-${index}`} />;
          const suggestion = suggestions.find((item) => item.day === day);
          const booked = bookedDays.has(day);
          const base = prices[day] ?? currentPrice(day);
          const delta = suggestion ? suggestion.suggested - currentPrice(day) : 0;
          const percent = suggestion ? Math.round((delta / currentPrice(day)) * 100) : 0;
          return (
            <button
              className={`day-cell ${booked ? "booked" : ""} ${suggestion ? (delta > 0 ? "raise" : "lower") : ""}`}
              key={day}
              onClick={openDetail}
              aria-label={`${day} December, ${booked ? "booked" : "available"}, current price ${money(base)}`}
            >
              <span className="day-top">
                <b>{day}</b>
                {eventDays.has(day) && (
                  <span className="event-text">
                    <Icon name="flag" size={14} />
                  </span>
                )}
              </span>
              <span className="base-price">{money(base)}</span>
              {booked ? (
                <small>
                  <Icon name="users" size={13} />
                  Booked
                </small>
              ) : (
                suggestion && (
                  <span className={`suggestion-chip ${delta > 0 ? "increase" : "decrease"}`}>
                    <Icon name={delta > 0 ? "arrow-up" : "arrow-down"} size={13} />
                    <b>{money(suggestion.suggested)}</b>
                    <em>
                      {delta > 0 ? "+" : "−"}
                      {Math.abs(percent)}%
                    </em>
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MoreOpportunities({
  openDetail,
  openReview,
}: {
  openDetail: () => void;
  openReview: () => void;
}) {
  const cards = [
    {
      tone: "measured" as const,
      type: "High demand",
      impact: "+₹4,800",
      title: "Holiday week, 20–23 Dec, underpriced",
      text: "4 open nights at ₹6,000. Demand is rising and similar listings charge more; suggested ₹7,200 (+20%).",
      link: "Review these nights",
      action: openReview,
    },
    {
      tone: "rust" as const,
      type: "Calendar gap",
      impact: "Up to ₹15,600",
      title: "3 empty nights, 8–10 Dec",
      text: "Stuck between two bookings. Lowering to ₹5,200 (−13%) matches similar weeknights; ₹15,600 if all three fill.",
      link: "Review these nights",
      action: openReview,
    },
    {
      tone: "neutral" as const,
      type: "Minimum stay",
      impact: "Protects 2 nights",
      title: "Set a 3-night minimum on 31 Dec",
      text: "Your average stay is 2.6 nights. A one-night NYE booking could leave 30 Dec and 1 Jan hard to sell.",
      link: "Add stay rule",
      action: openDetail,
    },
  ];
  return (
    <section className="panel more-opportunities">
      <div className="section-title">
        <h2>More opportunities</h2>
        <span>by potential value</span>
      </div>
      {cards.map((card) => (
        <article key={card.title}>
          <div className="opportunity-meta">
            <Badge tone={card.tone}>{card.type}</Badge>
            <strong>{card.impact}</strong>
          </div>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <button className="text-link" onClick={card.action}>
            {card.link} <Icon name="chevron" size={14} />
          </button>
        </article>
      ))}
    </section>
  );
}

function MarketIntelligence() {
  const bars = [
    ["1–6 Dec", 52],
    ["7–13", 58],
    ["14–20", 66],
    ["21–27", 84],
    ["28–31", 96],
  ] as const;
  return (
    <section className="panel intelligence">
      <div className="section-title">
        <h2>Market intelligence · Assagao</h2>
        <span className="sample-pill">Market Data suggested using AI</span>
      </div>
      <div className="market-content">
        <div>
          <h3>Area demand by week</h3>
          <div className="bar-chart">
            {bars.map(([label, value], i) => (
              <div className="bar-column" key={label}>
                <div className={`bar ${i > 2 ? "peak" : ""}`} style={{ height: `${value}%` }}>
                  <b>{value}</b>
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="chart-note">
            Demand index, 0–100. Peaks in the festival and New Year week.
          </p>
        </div>
        <div className="market-stats">
          <div>
            <span>Comparable prices</span>
            <strong>
              ₹7,400 <small>median</small>
            </strong>
            <p>Range ₹6,200–₹9,800 across 4 listings</p>
          </div>
          <div>
            <span>Comparable occupancy</span>
            <strong>
              61% <small>median</small>
            </strong>
            <p>You: 42% of December booked</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListingComparison() {
  return (
    <section className="panel listing-compare">
      <h2>Your listing vs similar</h2>
      <div className="compare-row">
        <span>Guest rating</span>
        <strong>4.86</strong>
        <small>Similar median 4.80</small>
      </div>
      <div className="compare-row">
        <span>Average length of stay</span>
        <strong>2.6 nights</strong>
        <small>Similar: 3.1 nights</small>
      </div>
      <div className="compare-row">
        <span>Booked how far ahead</span>
        <strong>21 days</strong>
        <small>Similar: 30 days</small>
      </div>
      <div className="compare-row">
        <span>Stands out for</span>
        <strong>Sea view, workspace</strong>
        <small>Missing vs 1 listing: pool</small>
      </div>
      <h3>What guests mention in reviews</h3>
      <div className="review-pills">
        <Badge>Sea view · positive</Badge>
        <Badge>Cleanliness · positive</Badge>
        <Badge tone="rust">Parking · mixed</Badge>
      </div>
    </section>
  );
}

function ComparableTable() {
  const rows = [
    ["You · Sea-view 2BHK", "Apartment · 4", "—", "4.86", "₹6,920", "42%", "Your listing"],
    ["Garden 2BHK", "Apartment · 4", "0.8 km", "4.72", "₹6,900", "64%", "Close match"],
    ["Modern 2BHK, Anjuna", "Apartment · 4", "2.6 km", "4.65", "₹6,200", "55%", "Close match"],
    [
      "Villa with plunge pool",
      "Villa · 4",
      "1.4 km",
      "4.91",
      "₹9,800",
      "74%",
      "Partial · private pool",
    ],
    ["Portuguese house", "House · 6", "1.9 km", "4.88", "₹7,900", "58%", "Partial · sleeps 2 more"],
  ];
  return (
    <section className="panel comparable-table">
      <div className="section-title">
        <div>
          <h2>Comparable listings</h2>
          <p>
            Chosen within 3 km for similar type, guest capacity and amenities. Differences are
            flagged so you can judge relevance.
          </p>
        </div>
        <button className="text-link">Edit comparable set</button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {[
                "Listing",
                "Type · guests",
                "Distance",
                "Rating",
                "Avg nightly · Dec",
                "Booked · Dec",
                "Relevance",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr className={i === 0 ? "you-row" : ""} key={row[0]}>
                {row.map((cell, j) => (
                  <td key={`${cell}-${j}`}>
                    {j === 6 ? (
                      <Badge tone={i === 0 ? "measured" : i < 3 ? "neutral" : "estimated"}>
                        {cell}
                      </Badge>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-link" onClick={onClick}>
      ← Back to calendar
    </button>
  );
}

function SummaryCard({
  label,
  children,
  note,
  featured = false,
}: {
  label: string;
  children: React.ReactNode;
  note: string;
  featured?: boolean;
}) {
  return (
    <article className={`panel summary-card ${featured ? "featured" : ""}`}>
      <span>{label}</span>
      <div>{children}</div>
      <p>{note}</p>
    </article>
  );
}

function PriceDetail({
  setScreen,
  setNightPrice,
}: {
  setScreen: (screen: Screen) => void;
  setNightPrice: (day: number, price: number) => void;
}) {
  const [price, setPrice] = useState(8400);
  const probabilityRaw = 1 / (1 + Math.exp((price - 10400) / 1100));
  const probability = Math.round(100 * probabilityRaw);
  const earnings = Math.round(price * probabilityRaw);
  const delta = price - 6000;
  const deltaPct = Math.round((delta / 6000) * 100);
  const recommendedEarnings = Math.round(
    (8400 * (100 / (1 + Math.exp((8400 - 10400) / 1100)))) / 100,
  );
  const earningDelta = earnings - recommendedEarnings;
  const verdict =
    price < 7600
      ? {
          tone: "decrease",
          icon: "warning" as const,
          text: "Very likely to book, but below every close match on a festival night.",
        }
      : price > 9400
        ? {
            tone: "decrease",
            icon: "warning" as const,
            text: "Higher price, but a real risk this night stays empty.",
          }
        : {
            tone: "increase",
            icon: "check" as const,
            text: "Close to the best balance of price and chance of booking for this night.",
          };
  const factors = [
    ["Base price", "Your setting", "Your weeknight setting", 6000],
    [
      "Nearby event",
      "Estimated",
      "Music festival 27–30 Dec, ~6 km away; based on similar past events",
      1300,
    ],
    ["Seasonality", "Estimated", "Late December is the area's peak season", 500],
    [
      "Competitor availability & prices",
      "Measured",
      "2 of 4 comparables already booked; open ones at ₹7,000–₹10,400",
      400,
    ],
    ["Local demand", "Measured", "Area demand index 96/100 for 28–31 Dec", 300],
    ["Booking lead time", "Estimated", "40 days out; peak dates here tend to book early", 200],
    [
      "Weekday vs weekend",
      "Measured",
      "Your Mondays book less often than your Fri–Sat nights",
      -300,
    ],
  ] as const;
  return (
    <>
      <Header goHome={() => setScreen("dashboard")} />
      <main className="page detail-page">
        <BackLink onClick={() => setScreen("dashboard")} />
        <div className="detail-heading">
          <div>
            <h1>Mon, 28 Dec 2026</h1>
            <div className="heading-badges">
              <Badge tone="event">Local event</Badge>
              <Badge>High demand</Badge>
            </div>
          </div>
          <p>Available · 40 days away (as of 18 Nov 2026) · 27 and 29 Dec are also open</p>
        </div>
        <div className="summary-grid">
          <SummaryCard label="Current price" note="Your weeknight setting">
            <strong>₹6,000</strong>
          </SummaryCard>
          <SummaryCard
            label="Recommended price"
            note="Within close-match listings' ₹7,000–₹9,000"
            featured
          >
            <strong>₹8,400</strong>
            <Change value={2400} percent={40} />
          </SummaryCard>
          <SummaryCard
            label="Expected earnings (estimate)"
            note="At current vs recommended price: price × chance of booking"
          >
            <span className="earnings-pair">
              <strong>₹5,892</strong>
              <Icon name="chevron" />
              <strong>₹7,227</strong>
            </span>
          </SummaryCard>
        </div>
        <div className="detail-grid">
          <div className="detail-main">
            <section className="panel price-lab">
              <div className="section-title">
                <h2>Try a different price</h2>
                <span>Nothing is saved until you set it</span>
              </div>
              <output>{money(price)}</output>
              <Change value={delta} percent={deltaPct} />
              <span className="vs-current">vs current</span>
              <div className="slider-wrap">
                <input
                  aria-label="Nightly price"
                  type="range"
                  min="4000"
                  max="14000"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ "--progress": `${(price - 4000) / 100}%` } as React.CSSProperties}
                />
                <div className="range-band">
                  <span>₹4,000</span>
                  <div>
                    <i />
                    <b>Close matches ₹7,000–₹9,000 · all comparables to ₹12,500</b>
                  </div>
                  <span>₹14,000</span>
                </div>
              </div>
              <div className="preset-row">
                {[
                  [6000, "Current"],
                  [8400, "Recommended"],
                  [9700, "Comparable median"],
                ].map(([value, label]) => (
                  <button
                    className={price === value ? "selected" : ""}
                    key={value}
                    onClick={() => setPrice(Number(value))}
                  >
                    {label} {money(Number(value))}
                  </button>
                ))}
              </div>
              <div className="forecast-grid">
                <div>
                  <span>Chance this night books (est.)</span>
                  <strong>{probability}%</strong>
                  <i>
                    <b style={{ width: `${probability}%` }} />
                  </i>
                </div>
                <div>
                  <span>Expected earnings (est.)</span>
                  <strong>{money(earnings)}</strong>
                  <small>
                    {earningDelta === 0
                      ? "Same as recommended"
                      : `${signedMoney(earningDelta)} vs recommended`}
                  </small>
                </div>
              </div>
              <p className={`verdict ${verdict.tone}`}>
                <Icon name={verdict.icon} />
                {verdict.text}
              </p>
              <div className="detail-actions">
                <Button
                  onClick={() => {
                    setNightPrice(28, price);
                    setScreen("dashboard");
                  }}
                >
                  Set {money(price)} for 28 Dec
                </Button>
                <Button variant="secondary" onClick={() => setScreen("review")}>
                  Review all suggestions
                </Button>
              </div>
              <p className="footnote">
                Booking chance uses a simple demand curve, not a trained model.
              </p>
            </section>
            <section className="panel confidence-card">
              <div className="section-title">
                <h2>Confidence</h2>
                <Badge tone="estimated">Medium</Badge>
              </div>
              {[
                ["check", "Based on your own December booking history (13 booked nights)."],
                ["check", "2 close-match listings have prices for this night."],
                ["warning", "Only 4 comparables in total, and 2 are partial matches."],
                [
                  "warning",
                  "The festival effect (+₹1,300) is estimated from past events, not measured for your listing.",
                ],
              ].map(([icon, text]) => (
                <p className={icon === "check" ? "increase" : "decrease"} key={text}>
                  <Icon name={icon as "check" | "warning"} />
                  {text}
                </p>
              ))}
            </section>
          </div>
          <aside className="detail-aside">
            <section className="panel breakdown-card">
              <div className="section-title">
                <h2>How we got to ₹8,400</h2>
                <div>
                  <Badge>Measured</Badge> <Badge tone="estimated">Estimated</Badge>
                </div>
              </div>
              <div className="factor-list">
                {factors.map(([name, tag, reason, amount], i) => (
                  <div className="factor" key={name}>
                    <div>
                      <strong>{name}</strong>
                      <Badge
                        tone={
                          tag === "Measured"
                            ? "measured"
                            : tag === "Estimated"
                              ? "estimated"
                              : "neutral"
                        }
                      >
                        {tag}
                      </Badge>
                      <p>{reason}</p>
                    </div>
                    <div className="factor-bar">
                      <i
                        className={amount < 0 ? "negative" : ""}
                        style={{
                          width: `${Math.min(50, Math.max(8, Math.abs(amount) / 30))}%`,
                          left:
                            amount < 0
                              ? `${50 - Math.min(50, Math.max(8, Math.abs(amount) / 30))}%`
                              : "50%",
                        }}
                      />
                    </div>
                    <b className={amount < 0 ? "decrease" : i > 0 ? "increase" : ""}>
                      {i === 0 ? money(amount) : signedMoney(amount)}
                    </b>
                  </div>
                ))}
              </div>
              <div className="factor-total">
                <strong>Recommended price</strong>
                <b>₹8,400</b>
              </div>
              <div className="note-box">
                <strong>₹2,000 of the ₹2,400 increase is estimated; ₹400 is measured.</strong>
                <p>
                  <b>Measured</b> comes from booking and listing data. <b>Estimated</b> is modelled
                  from patterns and is a judgement call you can override.
                </p>
              </div>
            </section>
            <ComparablesDetail />
          </aside>
        </div>
      </main>
    </>
  );
}

function ComparablesDetail() {
  const rows = [
    ["Garden 2BHK", "Close match", "Booked", "₹9,000"],
    ["Modern 2BHK, Anjuna", "Close match", "Open", "₹7,000"],
    ["Villa with plunge pool", "Partial · private pool", "Booked", "₹12,500"],
    ["Portuguese house", "Partial · sleeps 6", "Open", "₹10,400"],
  ];
  return (
    <section className="panel detail-comps">
      <div className="section-title">
        <h2>4 comparable listings on 28 Dec</h2>
        <span>2 close matches · 2 partial</span>
      </div>
      {rows.map((row) => (
        <div className="detail-comp-row" key={row[0]}>
          <strong>{row[0]}</strong>
          <Badge tone={row[1] === "Close match" ? "measured" : "estimated"}>{row[1]}</Badge>
          <span>{row[2]}</span>
          <b>{row[3]}</b>
        </div>
      ))}
    </section>
  );
}

function ReviewSuggestions({
  setScreen,
  applyPrices,
}: {
  setScreen: (screen: Screen) => void;
  applyPrices: (values: Record<number, number>) => void;
}) {
  const [selected, setSelected] = useState(() => new Set(suggestions.map((s) => s.day)));
  const [minPrice, setMinPrice] = useState(4500);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [state, setState] = useState<ReviewState>("review");
  const capped = (s: Suggestion) =>
    Math.max(minPrice || 0, Math.min(maxPrice || Infinity, s.suggested));
  const selectedRows = suggestions.filter((s) => selected.has(s.day));
  const changes = selectedRows.map((s) => capped(s) - 6000);
  const total = changes.reduce((a, b) => a + b, 0);
  const raiseValues = changes.filter((v) => v > 0);
  const dropValues = changes.filter((v) => v < 0);
  const adjustedCount = suggestions.filter((s) => capped(s) !== s.suggested).length;
  const toggle = (day: number) =>
    setSelected((previous) => {
      const next = new Set(previous);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  const setSelection = (mode: "all" | "none" | "raises") =>
    setSelected(
      new Set(
        mode === "all"
          ? suggestions.map((s) => s.day)
          : mode === "raises"
            ? suggestions.filter((s) => s.suggested > 6000).map((s) => s.day)
            : [],
      ),
    );
  const confirm = () => {
    applyPrices(Object.fromEntries(selectedRows.map((s) => [s.day, capped(s)])));
    setState("done");
  };
  const undo = () => {
    applyPrices({});
    setState("review");
  };
  return (
    <>
      <Header goHome={() => setScreen("dashboard")} />
      <main className="page review-page">
        <BackLink onClick={() => setScreen("dashboard")} />
        <div className="review-heading">
          <h1>Review price suggestions</h1>
          <p>
            December 2026 · 12 open nights with a suggestion. Booked nights are never changed.
            Nothing is applied until you confirm.
          </p>
        </div>
        <div className="review-grid">
          <section className="panel suggestion-table">
            <div className="table-toolbar">
              <div>
                <Button variant="secondary" onClick={() => setSelection("all")}>
                  Select all
                </Button>
                <Button variant="secondary" onClick={() => setSelection("none")}>
                  Clear all
                </Button>
                <Button variant="secondary" onClick={() => setSelection("raises")}>
                  Raises only
                </Button>
              </div>
              <strong>{selected.size} of 12 selected</strong>
            </div>
            <div className="suggestion-head">
              <span>Include</span>
              <span>Night</span>
              <span>Current</span>
              <span>Suggested</span>
              <span>Change</span>
              <span>Reason</span>
            </div>
            {suggestions.map((s) => {
              const value = capped(s),
                change = value - 6000,
                percent = Math.round((change / 6000) * 100),
                checked = selected.has(s.day);
              return (
                <label className={`suggestion-row ${checked ? "" : "deselected"}`} key={s.day}>
                  <span className="check-wrap">
                    <input type="checkbox" checked={checked} onChange={() => toggle(s.day)} />
                    <i>
                      <Icon name="check" size={14} />
                    </i>
                  </span>
                  <strong>{s.label}</strong>
                  <span>₹6,000</span>
                  <span>
                    <b>{money(value)}</b>
                    {value !== s.suggested && (
                      <small>Capped at your {value === maxPrice ? "max" : "min"}</small>
                    )}
                  </span>
                  <span>
                    <Change value={change} />
                    <small>
                      {percent >= 0 ? "+" : "−"}
                      {Math.abs(percent)}%
                    </small>
                  </span>
                  <span className="reason-cell">
                    {s.reason}
                    <Badge tone={s.evidence === "Measured" ? "measured" : "estimated"}>
                      {s.evidence}
                    </Badge>
                  </span>
                </label>
              );
            })}
          </section>
          <aside className="review-aside">
            <section className="panel impact-card">
              {state === "review" && (
                <>
                  <h2>Potential revenue impact</h2>
                  <strong className={total >= 0 ? "increase" : "decrease"}>
                    {signedMoney(total)}
                  </strong>
                  <p>
                    vs current prices, if every selected night books. Not a forecast: some nights
                    may stay empty.
                  </p>
                  <div className="impact-tiles">
                    <div>
                      <span>Raises</span>
                      <b>
                        {raiseValues.length} · {signedMoney(raiseValues.reduce((a, b) => a + b, 0))}
                      </b>
                    </div>
                    <div>
                      <span>Drops</span>
                      <b>
                        {dropValues.length} · {signedMoney(dropValues.reduce((a, b) => a + b, 0))}
                      </b>
                    </div>
                  </div>
                  <Button disabled={!selected.size} onClick={() => setState("confirm")}>
                    Review &amp; confirm {selected.size} prices
                  </Button>
                </>
              )}
              {state === "confirm" && (
                <>
                  <h2>Apply {selected.size} new prices?</h2>
                  <ul>
                    <li>
                      <Icon name="check" />
                      {raiseValues.length} raises and {dropValues.length} drops on open nights
                    </li>
                    <li>
                      <Icon name="check" />
                      All within your limits {money(minPrice)}–{money(maxPrice)}
                    </li>
                    <li>
                      <Icon name="check" />
                      Booked nights stay as they are
                    </li>
                    <li>
                      <Icon name="check" />
                      You can undo from the calendar at any time
                    </li>
                  </ul>
                  <Button onClick={confirm}>Confirm</Button>
                  <Button variant="secondary" onClick={() => setState("review")}>
                    Go back
                  </Button>
                </>
              )}
              {state === "done" && (
                <div className="done-state">
                  <span className="done-icon">
                    <Icon name="check" size={28} />
                  </span>
                  <h2>{selected.size} prices updated</h2>
                  <p>Your December calendar now shows the new prices.</p>
                  <Button onClick={() => setScreen("dashboard")}>Back to calendar</Button>
                  <Button variant="secondary" onClick={undo}>
                    Undo
                  </Button>
                </div>
              )}
            </section>
            <section className="panel limits-card">
              <h2>Your price limits</h2>
              <div>
                <label>
                  Minimum (₹)
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                </label>
                <label>
                  Maximum (₹)
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </label>
              </div>
              <p>
                {adjustedCount
                  ? `${adjustedCount} suggestion${adjustedCount === 1 ? " was" : "s were"} adjusted to stay inside your limits.`
                  : "Every suggestion is inside your limits. Change them and suggestions adjust automatically."}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [prices, setPrices] = useState<Record<number, number>>({});
  if (screen === "detail")
    return (
      <PriceDetail
        setScreen={setScreen}
        setNightPrice={(day, price) => setPrices((previous) => ({ ...previous, [day]: price }))}
      />
    );
  if (screen === "review")
    return <ReviewSuggestions setScreen={setScreen} applyPrices={setPrices} />;
  return <Dashboard setScreen={setScreen} prices={prices} />;
}
