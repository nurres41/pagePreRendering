import fs from "fs/promises";
import path from "path";
import Link from "next/link";

function HomePage(props) {
  return (
    <ul>
      {props.products.map((product) => (
        <Link href={`/${product.id}`}>
          <li key={product.id}>{product.title}</li>
        </Link>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-data.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }
  return {
    props: {
      products: data.products,
    },
    revalidate: 60,
  };
}

export default HomePage;
