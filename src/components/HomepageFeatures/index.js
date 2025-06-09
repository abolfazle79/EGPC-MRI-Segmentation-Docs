import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Translate from "@docusaurus/Translate";

const FeatureList = [
  {
    title: <Translate>Advanced Preprocessing</Translate>,
    Svg: require("@site/static/img/funnel.svg").default,
    description: (
      <>
        <Translate>
          Our framework begins with a robust, multi-stage preprocessing pipeline. By applying
          adaptive filtering, morphological operations, and intelligent skull stripping, we generate
          a highly accurate brain mask, ensuring that the optimization algorithm focuses only on
          relevant tissue and is not affected by noise or skull-edge artifacts.
        </Translate>
      </>
    ),
  },
  {
    title: <Translate>Intelligent Optimization with GPC</Translate>,
    Svg: require("@site/static/img/neural-network-pattern-and-brain-vector.svg").default,
    description: (
      <>
        <Translate>
          At the core of our method lies an enhanced Giza Pyramids Construction (GPC) metaheuristic.
          We have augmented the standard algorithm with adaptive operators, a smart initialization
          strategy, and stagnation-aware mechanisms. This allows our model to robustly escape local
          optima and efficiently search the solution space to find the most accurate tumor
          boundaries.
        </Translate>
      </>
    ),
  },
  {
    title: <Translate>Accurate & Reproducible Results</Translate>,
    Svg: require("@site/static/img/target.svg").default,
    description: (
      <>
        <Translate>
          Our framework provides a complete pipeline from raw MRI to a final segmented tumor mask.
          By integrating intelligent post-processing and setting a fixed random seed, the system
          delivers highly accurate and, most importantly, scientifically reproducible results every
          time, making it a reliable tool for both clinical and research applications.
        </Translate>
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p style={{ textAlign: "justify" }}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
