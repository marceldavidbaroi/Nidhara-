import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "💰 Finance Mastery",

    Svg: () => (
      <img src="/img/finance.svg" alt="Finance" style={{ height: "150px" }} />
    ),

    description: (
      <ul>
        <li>
          <strong>Smart Ledgers:</strong> Manage accounts and transactions with
          precision.
        </li>
        <li>
          <strong>Purposeful Savings:</strong> Set and visualize goals for your
          future.
        </li>
        <li>
          <strong>Intuitive Categorization:</strong> Understand exactly where
          your "treasure" flows.
        </li>
      </ul>
    ),
    color: "#188FA7",
  },
  {
    title: "🌱 Personal Evolution",
    Svg: () => (
      <img src="/img/grow.svg" alt="Finance" style={{ height: "150px" }} />
    ),
    description: (
      <ul>
        <li>
          <strong>LifeLog & Capsule:</strong> Capture moments and milestones in
          a digital time capsule.
        </li>
        <li>
          <strong>Knowledge Base:</strong> A curated space for your ideas,
          notes, and learnings.
        </li>
        <li>
          <strong>Micro Actions:</strong> Transform big dreams into daily,
          manageable steps.
        </li>
      </ul>
    ),
    color: "#769FB6",
  },
  {
    title: "🔐 Architecture & Security",
    Svg: () => (
      <img src="/img/security.svg" alt="Finance" style={{ height: "150px" }} />
    ),
    description: (
      <ul>
        <li>
          <strong>Multi-User Ecosystem:</strong> Sophisticated roles and
          permissions for shared management.
        </li>
        <li>
          <strong>Insights & Analytics:</strong> Beautiful dashboards that turn
          data into wisdom.
        </li>
        <li>
          <strong>Scalable Soul:</strong> A modular design built to evolve as
          you do.
        </li>
      </ul>
    ),
    color: "#9DBBAE",
  },
];

function Feature({ Svg, title, description, color, reverse }) {
  return (
    <section className={styles.featureSection}>
      <div className={clsx(styles.featureContainer, reverse && styles.reverse)}>
        <div className={styles.iconWrapper}>
          <Svg />
        </div>
        <div className={styles.textWrapper}>
          <Heading as="h3" style={{ color, marginBottom: "1rem" }}>
            {title}
          </Heading>
          <div>{description}</div>
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures() {
  return (
    <div>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} reverse={idx % 2 === 1} />
      ))}
    </div>
  );
}
